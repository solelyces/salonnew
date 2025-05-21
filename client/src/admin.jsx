import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const AdminDashboard = ({}) => {
 const [activeSection, setActiveSection] = useState('home');
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [paidTransactions, setPaidTransactions] = useState([]);
  
  // Combine the newUser  state into one declaration
  const [newUser , setNewUser ] = useState({
    user_id: '',
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    role: 'Client'
  });
  const [editingUserIndex, setEditingUserIndex] = useState(null);
  const [message, setMessage] = useState('');
const salesChartInstance = useRef(null);
const userDistributionChartInstance = useRef(null);
const [userCount, setUserCount] = useState(0);
const [transactionCount, setTransactionCount] = useState(0);
const [pendingCount, setPendingCount] = useState(0);
const [hoveredCard, setHoveredCard] = useState(null);


  // Fetch users and transactions from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data); // Assuming response.data is an array of users
        setUserCount(response.data.length); // Set user count
      } catch (error) {
        console.error('Error fetching users:', error);
        setMessage('Failed to fetch users.');
      }
    };
    fetchUsers();

       const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/transactions'); // Adjust the URL as necessary
      console.log('Fetched Transactions:', response.data); // Log the response data
      setTransactions(response.data); // Assuming response.data is an array of transactions
      setTransactionCount(response.data.length); // Set transaction count
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setMessage('Failed to fetch transactions.');
    }
  };
  fetchTransactions();


    const fetchPending = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/transactions-pending'
       );
      
      setPendingTransactions(response.data);
      setPendingCount(response.data.length); // Set pending transaction count
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
    }
  };

  // Fetch paid transactions
  const fetchPaid = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/transactions-paid'
       );
      setPaidTransactions(response.data);
    } catch (error) {
      console.error('Error fetching paid transactions:', error);
    }
  };

  fetchPending();
  fetchPaid();

  const salesData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: 'Sales',
        data: [1200, 1500, 1800, 1400, 1700, 2100, 2400, 2200, 2600, 3000, 3200, 3500],
        fill: false,
        borderColor: '#4a90e2',
        backgroundColor: '#4a90e2',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8,
      }]
    };

    const salesConfig = {
      type: 'line',
      data: salesData,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#35495e' }
          },
          x: {
            ticks: { color: '#35495e' }
          }
        }
      }
    };

    const userDistributionData = {
      labels: ['Users', 'Transactions', 'Pending Payments'],
      datasets: [{
        label: 'Data Overview',
        data: [userCount, transactionCount, pendingCount],
        borderColor: ['#4a90e2', '#50e3c2', '#f5a623'],
        hoverOffset: 30
      }]
    };

 



    // Recent activity sample data
    const activities = [
      { time: 'Just now', description: 'New user registration: johndoe' },
      { time: '15 minutes ago', description: 'Order #4567 completed' },
      { time: '1 hour ago', description: 'Product "Wireless Mouse" updated' },
      { time: '2 hours ago', description: 'New feedback received from user "janedoe"' },
      { time: 'Yesterday', description: 'Monthly revenue report generated' },
      { time: '2 days ago', description: 'User "techguy" password changed' },
    ];

    // Populate recent activity list dynamically
    const activityList = document.getElementById('activityList');
    activities.forEach(act => {
      const div = document.createElement('div');
      div.className = 'activity-item';
      div.textContent = `${act.time} - ${act.description}`;
      activityList.appendChild(div);
    });

  

    if (salesChartInstance.current) {
    salesChartInstance.current.destroy();
  }
  if (userDistributionChartInstance.current) {
    userDistributionChartInstance.current.destroy();
  }

  const salesChartCtx = document.getElementById('salesChart').getContext('2d');
  const userDistChartCtx = document.getElementById('userDistributionChart').getContext('2d');

  // Create new charts
  salesChartInstance.current = new Chart(salesChartCtx, salesConfig);
 
  // Create user distribution chart with dynamic data
  const dynamicUserDistributionData = {
    labels: ['Users', 'Transactions', 'Pending Payments'],
    datasets: [{
      label: 'Data Overview',
      data: [userCount, transactionCount, pendingCount],
      backgroundColor: ['#4a90e2', '#50e3c2', '#f5a623'],
      hoverOffset: 30,
    }],
  };

  const userDistributionConfig = {
    type: 'doughnut',
    data: dynamicUserDistributionData,
    options: {
      responsive: true,
      cutout: '60%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#35495e', font: { size: 14 } } },
        tooltip: { enabled: true }
      }
    }
  };

  userDistributionChartInstance.current = new Chart(userDistChartCtx, userDistributionConfig);

  // Cleanup function
  return () => {
    if (salesChartInstance.current) {
      salesChartInstance.current.destroy();
    }
    if (userDistributionChartInstance.current) {
      userDistributionChartInstance.current.destroy();
    }
  };
}, [userCount, transactionCount, pendingCount]);

const handleMouseEnter = (cardId) => {
  setHoveredCard(cardId);
};

const handleMouseLeave = () => {
  setHoveredCard(null);
};

// Inside your AdminDashboard component:

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleString('en-US', options).toLowerCase();
};

const handleAddUser = async () => {
  try {
    if (isEditing) {
      // For updating
      const updatedUser = { ...newUser }; // include user_id
      console.log('Updating user:', updatedUser); // Debug
      const response = await axios.put(`http://localhost:3000/api/users/${updatedUser.user_id}`, updatedUser);
      if (response.status === 200) {
        const updatedUsers = [...users];
        updatedUsers[editingUserIndex] = updatedUser;
        setUsers(updatedUsers);
        alert('User updated successfully!');
      }
    } else {
      // For adding
      const response = await axios.post('http://localhost:3000/signup', newUser);
      if (response.status === 201) {
        setUsers([...users, newUser]);
        alert('User added successfully!');
      }
    }
  } catch (error) {
    console.error('Error adding/updating user:', error);
    alert('Failed to update user.');
  } finally {
    // Reset form
    setNewUser({ firstname: '', lastname: '', username: '', email: '', password: '' });
    setEditingUserIndex(null);
    setIsEditing(false);
  }
};

const handleEditUser = (index) => {
  const userToEdit = users[index];
  setNewUser({
    user_id: userToEdit.user_id, // Ensure this exists
    firstname: userToEdit.firstname,
    lastname: userToEdit.lastname,
    username: userToEdit.username,
    email: userToEdit.email,
    password: '', // optional
  });
  console.log('Preparing to update, newUser:', newUser);
  setEditingUserIndex(index);
  setIsEditing(true);
};

  

const handleDeleteUser = (user_id) => {
  // Log the user_id for debugging
  console.log('Attempting to delete user with ID:', user_id);
  
  // Show confirmation dialog
  const confirmDelete = window.confirm('Are you sure you want to delete this user?');

  if (confirmDelete) {
    // Proceed with delete request
    fetch(`http://localhost:3000/api/users/${user_id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          alert('User deleted successfully!');
          setUsers(prevUsers => prevUsers.filter(user => user.id !== user_id));
        } else {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
      })
      .catch((err) => {
        alert('Error deleting user: ' + err.message);
      });
  } else {
    // User canceled the deletion
    console.log('Deletion canceled for user ID:', user_id);
  }
};


const handleDeclineTransaction = async (index) => {
  const transaction = transactions[index];
  const recordID = transaction.recordID;
  console.log('Attempting to decline transaction with ID:', recordID);

  // Show a confirmation dialog
  const userConfirmed = window.confirm(`Are you sure you want to decline transaction with ID: ${recordID}?`);
  if (!userConfirmed) {
    return; // User canceled
  }

  try {
    await axios.put(`http://localhost:3000/api/transactions/${recordID}`, { status: 'Declined' });
    const updatedTransactions = [...transactions];
    updatedTransactions[index].status = 'Declined'; // Update local state
    setTransactions(updatedTransactions);
    alert('Transaction declined!');
  } catch (error) {
    console.error('Error declining transaction:', error);
    alert('Failed to decline transaction.');
  }
};



const handleConfirmTransaction = async (transaction) => {
  const recordID = transaction.recordID;
  console.log('Confirming transaction with ID:', recordID);

  const userConfirmed = window.confirm(`Are you sure you want to confirm transaction with ID: ${recordID}?`);
  if (!userConfirmed) return;

  try {
    await axios.put(`http://localhost:3000/api/transactions/${recordID}`, { status: 'Paid' });
    // Update local state: remove from pending, add to paid, or refresh data
    setPendingTransactions(prev => prev.filter(t => t.recordID !== recordID));
    // Optionally, fetch updated lists
    fetchPending();
    fetchPaid();
    alert('Transaction confirmed successfully!');
  } catch (error) {
    console.error('Error confirming transaction:', error);
    alert('Failed to confirm transaction.');
  }
};

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Simulate logging out (e.g., clear user data)
      setUsers([]);
      setAppointments([]);
      alert('Logged out successfully!');
      
      // Redirect to the homepage (or login page)
      window.location.href = '/'; // Change this to your actual login page URL
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <main className="main-content" role="main" aria-label="Dashboard main content" style={styles.mainContent}>
      <header className="header" style={styles.header}>
        <h1 style={styles.headerTitle}>Welcome, Admin!</h1>
      </header>

      <section className="stats-cards" aria-label="Overview statistics" style={styles.statsCards}>
        <article
          className="card"
          tabIndex={0}
          aria-labelledby="users-title users-value"
          style={{
            ...styles.card,
            transform: hoveredCard === 'users' ? 'translateY(-8px)' : 'none',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={() => handleMouseEnter('users')}
          onMouseLeave={handleMouseLeave}
        >
          <h3 id="users-title" style={styles.cardTitle}>Users</h3>
          <div className="value" id="users-value" style={styles.cardValue}>{users.length}</div>
          {hoveredCard === 'users' && (
            <div style={styles.tooltip} onClick={() => setActiveSection('users')}>
              <p>(Click to Manage Users)</p>
            </div>
          )}
        </article>
        <article
          className="card"
          tabIndex={0}
          aria-labelledby="orders-title orders-value"
          style={{
            ...styles.card,
            transform: hoveredCard === 'transactions' ? 'translateY(-5px)' : 'none',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={() => handleMouseEnter('transactions')}
          onMouseLeave={handleMouseLeave}
        >
          <h3 id="orders-title" style={styles.cardTitle}>Transactions</h3>
          <div className="value" id="orders-value" style={styles.cardValue}>{transactions.length}</div>
          {hoveredCard === 'transactions' && (
            <div style={styles.tooltip} onClick={() => setActiveSection('appointments')}>
              <p>(Click to Manage Transactions)</p>
            </div>
          )}
        </article>

        <article
          className="card"
          tabIndex={0}
          aria-labelledby="revenue-title revenue-value"
          style={{
            ...styles.card,
            transform: hoveredCard === 'pendingTransactions' ? 'translateY(-5px)' : 'none',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={() => handleMouseEnter('pendingTransactions')}
          onMouseLeave={handleMouseLeave}
        >
          <h3 id="revenue-title" style={styles.cardTitle}>Pending Transactions</h3>
          <div className="value" id="revenue-value" style={styles.cardValue}>{pendingTransactions.length}</div>
          {hoveredCard === 'pendingTransactions' && (
            <div style={styles.tooltip} onClick={() => setActiveSection('appointments')}>
              <p>(Click to Manage Transactions)</p>
            </div>
          )}
        </article>
        <article className="card" tabIndex={0} aria-labelledby="feedback-title feedback-value" style={styles.card}>
          <h3 id="feedback-title" style={styles.cardTitle}>Revenues</h3>
          <div className="value" id="feedback-value" style={styles.cardValue}>187</div>
        </article>
      </section>

      <section className="charts-container" aria-label="Data visualization charts" style={styles.chartsContainer}>
        <article className="chart-card" aria-labelledby="sales-chart-title" style={styles.chartCard}>
          <h3 id="sales-chart-title" style={styles.chartTitle}>Sales Over Time</h3>
          <canvas id="salesChart" width="400" height="250" role="img" aria-label="Line chart showing sales over time"></canvas>
        </article>
        <article className="chart-card" aria-labelledby="user-distribution-title" style={styles.chartCard}>
          <h3 id="user-distribution-title" style={styles.chartTitle}>System Overview</h3>
          <canvas id="userDistributionChart" width="400" height="250" role="img" aria-label="Pie chart showing user distribution"></canvas>
        </article>
      </section>

      <section className="activity-section" aria-label="Recent activity" style={styles.activitySection}>
        <h3 style={styles.activityTitle}>Recent Activity</h3>
        <div className="activity-list" id="activityList" tabIndex={0} aria-live="polite" style={styles.activityList}>
          {/* Activity items will be populated by useEffect */}
        </div>
      </section>
    </main>

        );
      case 'users':
        return (
          <div>
            <div style={styles.CurrentUsers}>
            <h4>Current Users:</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User Id</th>
                  <th style={styles.th}>First Name</th>
                  <th style={styles.th}>Last Name</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{user.user_id}</td>
                    <td style={styles.td}>{user.firstname}</td>
                    <td style={styles.td}>{user.lastname}</td>
                    <td style={styles.td}>{user.username}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.role}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleEditUser (index)} style={styles.editButton}>Edit</button>
                      <button onClick={() => handleDeleteUser (user.user_id)} style={styles.deleteButton}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <div style={styles.ManageUsers}>
              <h3 style={styles.h3}>Manage Users</h3>
              <input
                type="text"
                placeholder="User ID"
                value={newUser.user_id}
                style={styles.inputManageUsers}
                onChange={e => setNewUser({ ...newUser, user_id: e.target.value })}
              />
              <input
                type="text"
                placeholder="First Name"
                value={newUser.firstname}
                style={styles.inputManageUsers}
                onChange={e => setNewUser({ ...newUser, firstname: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.lastname}
                style={styles.inputManageUsers}
                onChange={e => setNewUser({ ...newUser, lastname: e.target.value })}
              />
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                style={styles.inputManageUsers}
                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                style={styles.inputManageUsers}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                style={styles.inputManageUsers}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              />
              <select
                value={newUser.role}
                style={styles.inputManageUsers}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option>Admin</option>
                <option>Client</option>
              </select>
              <button onClick={handleAddUser } style={styles.buttonAddUser}>
              {isEditing ? 'Save Changes' : 'Add User'}
            </button>
            </div>

          </div>
        );
      case 'appointments':
  return (
    <div>
      {/* Pending Transactions Table */}
      <div style={styles.CurrentUsers}>
        <h4>Pending Transactions:</h4>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Record ID</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Service Name</th>
              <th style={styles.th}>Payment Description</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingTransactions.map((transaction, index) => (
              <tr key={transaction.recordID}>
                <td style={styles.td}>{transaction.recordID}</td>
                <td style={styles.td}>{transaction.username}</td>
                <td style={styles.td}>{transaction.services_name}</td>
                <td style={styles.td}>{transaction.paymentdescription}</td>
                <td style={styles.td}>{formatDate(transaction.Date)}</td>
                <td style={styles.td}>{formatTime(transaction.Time)}</td>
                <td style={styles.td}>{transaction.total}</td>
                <td style={styles.td}>{transaction.status}</td>
                <td style={styles.td}>
                  <button onClick={() => handleConfirmTransaction(transaction)} style={styles.editButton}>Confirm</button>
                  <button onClick={() => handleDeclineTransaction(index)} style={styles.deleteButton}>Decline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paid Transactions Table */}
      <div style={styles.CurrentUsers}>
        <h4>Paid Transactions:</h4>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Record ID</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Service Name</th>
              <th style={styles.th}>Payment Description</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paidTransactions.map((transaction, index) => (
              <tr key={transaction.recordID}>
                <td style={styles.td}>{transaction.recordID}</td>
                <td style={styles.td}>{transaction.username}</td>
                <td style={styles.td}>{transaction.services_name}</td>
                <td style={styles.td}>{transaction.paymentdescription}</td>
                <td style={styles.td}>{formatDate(transaction.Date)}</td>
                <td style={styles.td}>{formatTime(transaction.Time)}</td>
                <td style={styles.td}>{transaction.total}</td>
                <td style={styles.td}>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
        return (
          <div>


            <div style={styles.CurrentUsers}>
              <h4>Current Transactions:</h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Record ID</th>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>Service Name</th>
                    <th style={styles.th}>Payment Description</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Time</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={transaction.recordID}>
                      <td style={styles.td}>{transaction.recordID}</td>
                      <td style={styles.td}>{transaction.username}</td>
                      <td style={styles.td}>{transaction.services_name}</td>
                      <td style={styles.td}>{transaction.paymentdescription}</td>
                      <td style={styles.td}>{formatDate(transaction.Date)}</td>
                      <td style={styles.td}>{formatTime(transaction.Time)}</td>
                      <td style={styles.td}>{transaction.total}</td>
                      <td style={styles.td}>{transaction.status}</td>
                      <td style={styles.td}>
                        <button onClick={() => handleConfirmTransaction(index)} style={styles.editButton}>Confirm</button>
                        <button onClick={() => handleDeclineTransaction(index)} style={styles.deleteButton}>Decline</button>
                      </td>
                    </tr>
                  ))}
                </tbody>


              </table>
            </div>
          </div>
        );




      case 'settings':
        return (
          <div style={styles.settingsContainer}>
  <h2>Account Settings</h2>
  
  {/* Profile Info */}
  <section style={styles.section}>
    <h3>Profile Information</h3>
    <input type="text" placeholder="Full Name" style={styles.input} />
    <input type="email" placeholder="Email Address" style={styles.input} />
    <input type="file" accept="image/*" style={styles.fileInput} />
    {/* Display current profile picture */}
  </section>
  
  {/* Password Change */}
  <section style={styles.section}>
    <h3>Change Password</h3>
    <input type="password" placeholder="Current Password" style={styles.input} />
    <input type="password" placeholder="New Password" style={styles.input} />
    <input type="password" placeholder="Confirm New Password" style={styles.input} />
    <button style={styles.button}>Update Password</button>
  </section>
  
  {/* Notification Preferences */}
  <section style={styles.section}>
    <h3>Notification Preferences</h3>
    <label>
      <input type="checkbox" /> Email Notifications
    </label>
    <label>
      <input type="checkbox" /> SMS Notifications
    </label>
    <label>
      <input type="checkbox" /> Push Notifications
    </label>
  </section>
  
  {/* Privacy Settings */}
  <section style={styles.section}>
    <h3>Privacy Settings</h3>
    <select style={styles.select}>
      <option value="public">Public Profile</option>
      <option value="private">Private Profile</option>
    </select>
    <button style={styles.button}>Save Privacy</button>
  </section>
  
  {/* Appearance & Theme */}
  <section style={styles.section}>
    <h3>Appearance</h3>
    <button style={styles.button}>Toggle Dark Mode</button>
    <select style={styles.select}>
      <option value="en">English</option>
      <option value="es">Spanish</option>
      {/* Add more languages */}
    </select>
  </section>
  
  {/* Save Changes Button */}
  <div style={{ marginTop: '20px' }}>
    <button style={styles.saveButton}>Save All Changes</button>
  </div>
</div> 
        );
      default:
        return null;
    }
  };

  const styles = {
    ManageUsers: {
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.26)',
      padding: '30px',
      borderRadius: '8px',
      margin: '20px',
    },
    CurrentUsers: {
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.26)',
      padding: '50px',
      borderRadius: '8px',
      margin: '20px' ,
    },
    h3: {
      marginBottom: '20px',
    },
    dashboard: {
      display: 'flex',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
    },
    sidebar: {
      width: '200px',
      backgroundColor: '#f4f4f4',
      padding: '20px',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    content: {
      flex: 1,
      padding: '20px',
      backgroundColor: '#ffffff',
    },
    button: {
      display: 'block',
      margin: '10px 0',
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonAddUser: {
      width: '40%',
      display: 'block',
      margin: '10px auto',
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
  },
    buttonActive: {
      backgroundColor: '#0056b3',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
    },
    inputManageUsers: {
      width: '20%',
      padding: '10px',
      margin: '5px 5px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
    },
    select: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
    },
    list: {
      listStyleType: 'none',
      padding: 0,
    },
    listItem: {
      padding: '10px',
      borderBottom: '1px solid #ccc',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    message: {
      color: 'green',
      marginTop: '10px',
    },
    logoutButton: {
      marginTop: 'auto', // Pushes the button to the bottom
      padding: '10px',
      backgroundColor: '#dc3545', // Bootstrap danger color
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    backgroundColor: '#f4f4f4',
    padding: '20px',
    textAlign: 'left',
    borderBottom: '2px solid #ccc',
  },
  td: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ccc',
  },
  editButton: {
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: '20px 40px',
    backgroundColor: '#f5f7fa',
    height: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerTitle: {
    margin: 0,
    fontSize: '2rem',
    color: '#35495e',
  },
  statsCards: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
    flex: '1 1 220px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'default',
    transition: 'box-shadow 0.3s ease',
  },
  cardTitle: {
    margin: '0 0 12px 0',
    fontWeight: '600',
    color: '#35495e',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#4a90e2',
  },
  chartsContainer: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
    flex: '1 1 480px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  chartTitle: {
    margin: '0 0 20px 0',
    fontWeight: '600',
    color: '#35495e',
  },
  activitySection: {
    marginTop: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
    padding: '24px',
    flexShrink: 0,
  },
  activityTitle: {
    marginTop: 0,
    fontWeight: '600',
    color: '#35495e',
    marginBottom: '16px',
  },
  activityList: {
    maxHeight: '220px',
    overflowY: 'auto',
  },
  settingsContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '20px',
  },
  fileInput: {
    marginTop: '8px',
    marginBottom: '12px',
  },
  saveButton: {
    padding: '12px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
  },
tooltip: {
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.41)',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  cursor: 'pointer',
  zIndex: 1000,
  width: '70%',
  top: '65%', // Position it below the parent element
  left: '25px',   // Align to the left of parent
  marginTop: '20px', // space below the card
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '15px',
},
   cardContainer: {
    position: 'relative',
    display: 'inline-block', // or flex, depending on layout
  },
  };
  
    
  
    return (
      <div style={styles.dashboard}>
        <div style={styles.sidebar}>
          <h2>Admin Menu</h2>
          <button
            style={{ ...styles.button, ...(activeSection === 'home' ? styles.buttonActive : {}) }}
            onClick={() => setActiveSection('home')}
          >
            Home
          </button>
          <button
            style={{ ...styles.button, ...(activeSection === 'users' ? styles.buttonActive : {}) }}
            onClick={() => setActiveSection('users')}
          >
            Manage Users
          </button>
          <button
            style={{ ...styles.button, ...(activeSection === 'appointments' ? styles.buttonActive : {}) }}
            onClick={() => setActiveSection('appointments')}
          >
            Manage Appointments
          </button>
          <button
            style={{ ...styles.button, ...(activeSection === 'settings' ? styles.buttonActive : {}) }}
            onClick={() => setActiveSection('settings')}
          >
            Settings
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Log Out
          </button>
        </div>
        <div style={styles.content}>
          <h2>Admin Dashboard</h2>
          {message && <p style={styles.message}>{message}</p>}
          {renderContent()}
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;
  