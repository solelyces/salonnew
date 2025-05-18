const express = require('express');
const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Setup MySQL connection
const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',       // your mysql username
  password: '',       // your mysql password
  database: 'system'  // make sure this database exists
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');

});

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
  
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password and role are required' });
    }
    if (!['Admin', 'Client'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
  
    // Check if user exists
    db.query('SELECT * FROM customer_info WHERE username = ?', [username], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length > 0) {
        return res.status(409).json({ message: 'Username already taken' });
      }
  
      // Hash password
      const hash = await bcrypt.hash(password, 10);
  
      // Insert new user
      db.query('INSERT INTO customer_info (firstname, lastname, email, username, password, role) VALUES (?, ?, ?,?, ?, ?)',
        [req.body.firstname, req.body.lastname, req.body.email, username, hash, role],
        (err) => {
          if (err) return res.status(500).json({ message: 'Database error inserting user' });
          res.status(201).json({ message: 'User created' }); 
      });
    });
  });

// Login endpoint
// Login endpoint
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;
  
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password and role are required' });
    }
    if (!['Admin', 'Client'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
  
    // Find user by username
    db.query('SELECT * FROM customer_info WHERE username = ? AND role = ?', [username, role], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const user = results[0];
      // Change this line to use the correct field name
      const match = await bcrypt.compare(password, user.password); // Use user.password instead of user.password_hash
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Login successful
      res.json({ message: `Login successful as ${role}` });
    });
  });

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const query = `SELECT * FROM customer_info WHERE username = ? AND password = ?`;
  
    db.query(query, [username, password], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length > 0) {
        const user = results[0]; // Assuming this returns the user object
        // Return relevant user info like ID, name, and any other fields you might need
        return res.json({
          userId: user.id,
          firstName: user.firstname,
          lastName: user.lastname,
          username: user.username,
          email: user.email
        });
      } else {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    });
  });


  app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM customer_info';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.send(results);
    });
  });

app.get('/api/users/:id', (req, res) => {
  console.log('Received GET request for user:', req.params.id);
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).send('Invalid user ID');
  }
  const query = 'SELECT * FROM customer_info WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(results[0]);
  });
});

  app.put('/api/users/:id', (req, res) => {
    const user_id = req.params.id;
    const { firstname, lastname, email, username, password } = req.body;

    const query = 'UPDATE customer_info SET firstname = ?, lastname = ?, email = ?, username = ?, password = ? WHERE user_id = ?';
    db.query(query, [firstname, lastname, email, username, password, user_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).send('User not found');
      }
      res.send('User updated successfully');
    });
  });

app.delete('/api/users/:id', (req, res) => {
  console.log('Received delete request for user:', req.params.id);
  // Convert the route parameter to an integer
  const userId = parseInt(req.params.id, 10);

  // Debugging: log the userId
  console.log('Parsed user_id:', userId);

  // Check if the conversion was successful
  if (isNaN(userId)) {
    return res.status(400).send('Invalid user ID');
  }

  const query = 'DELETE FROM customer_info WHERE user_id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    // Check if any rows were affected (i.e., a user was deleted)
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    // Send success message
    res.send('User deleted successfully');
  });
});


  app.get('/api/services', (req, res) => {
    const sql = 'SELECT services_id, services_name, CAST(price AS DECIMAL(10,2)) as price, Service_Description, IFNULL(TO_BASE64(Picture), "") AS Picture FROM services_info';
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.send(results);
    });
  });
  

  // Endpoint to fetch payment options
app.get('/api/payment-options', (req, res) => {
  const query = 'SELECT paymentdescription FROM payment_info';

  db.query(query, (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
  });
});


app.put('/api/transactions/:id', (req, res) => {
  const recordID = parseInt(req.params.id, 10);
  const { status } = req.body;

  const query = 'UPDATE transactions SET status = ? WHERE recordID = ?';

  db.query(query, [status, recordID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    // Send back a message with the new status
    res.json({ message: `Transaction status updated to ${status}` });
  });
});
  
  app.post('/transactions', (req, res) => {
    user_id:user.id;
    
    const { user_id, services_id, paymentinfo_id, appointment_date, appointment_time, total, status } = req.body;

    // Debug log incoming transaction request
    console.log("Received transaction request:", req.body);
    console.log("Request Data - User ID:", user_id, "Services ID:", services_id, "Payment Info ID:", paymentinfo_id, "Date:", appointment_date, "Time:", appointment_time, "Total:", total, "Status:", status);
    
    // Insert into the database
    const query = `INSERT INTO transactions (user_id, services_id, paymentinfo_id, Date, Time, total, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [user_id, services_id, paymentinfo_id, appointment_date, appointment_time, total, status], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Transaction created successfully', recordId: result.insertId });
    });
});



app.get('/api/transactions', async (req, res) => {
  // Create a new connection for this request
  const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'system'
  });

  // Connect to the database
  connection.connect(error => {
    if (error) {
      console.error('Error connecting to database:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  });

  try {
    const [rows] = await connection.promise().query(`
      SELECT 
        t.recordID, 
        c.username, 
        s.services_name, 
        p.paymentdescription, 
        t.Date, 
        t.Time, 
        t.total, 
        t.status
      FROM transactions t
      INNER JOIN customer_info c ON t.user_id = c.user_id
      INNER JOIN services_info s ON t.services_id = s.services_id
      INNER JOIN payment_info p ON t.paymentinfo_id = p.paymentinfo_id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the connection
    connection.end();
  }
});


app.get('/api/transactions', (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id parameter' });
  }

  const sql = `
      SELECT 
        t.recordID,
        t.user_id,
        s.services_name,
        p.paymentdescription,
        t.Date,
        t.Time,
        t.total,
        t.status
      FROM transactions t
      JOIN services_info s ON t.services_id = s.services_id
      JOIN payment_info p ON t.paymentinfo_id = p.paymentinfo_id
      WHERE t.user_id = ?
  `;

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});


  
  app.delete('/transactions/:id', (req, res) => {
    const transactionId = req.params.id;
  
    const query = `DELETE FROM transactions WHERE recordID = ?`;
  
    db.query(query, [transactionId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json({ message: 'Transaction deleted successfully' });
    });
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});