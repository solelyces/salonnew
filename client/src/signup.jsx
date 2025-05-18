import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate

function SignupForm() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!firstname || !lastname || !username || !email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, username, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Signup successful! You can now login.');
        // Optionally reset form
        setFirstname('');
        setLastname('');
        setUsername('');
        setEmail('');
        setPassword('');
        setRole('Admin');
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (error) {
      setMessage('Error connecting to server.');
    }

    setLoading(false);
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      marginTop: '10rem',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
      color: 'black',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    message: {
      color: 'red',
      marginTop: '10px',
    },
    backIcon: {
      position: 'absolute',
      top: '15px',
      left: '15px',
      cursor: 'pointer',
      width: '24px',
      height: '24px',
      fill: '#007bff',
      transition: 'fill 0.3s ease',
    },
    backIconHover: {
      fill: '#0056b3',
    },
  };

  const [hover, setHover] = useState(false);

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignup}>
        {/* Back Icon as SVG */}
        <svg
          onClick={handleBack}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ ...styles.backIcon, fill: hover ? styles.backIconHover.fill : styles.backIcon.fill }}
          aria-label="Go back"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleBack(); } }}
        >
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>

        <h2>Sign Up</h2>

        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={e => setFirstname(e.target.value)}
          disabled={loading}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={e => setLastname(e.target.value)}
          disabled={loading}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          style={styles.input}
        />

        <label>
          Role:
          <select value={role} onChange={e => setRole(e.target.value)} disabled={loading} style={styles.input}>
            <option>Admin</option>
            <option>Client</option>
          </select>
        </label>

        <button type="submit" disabled={loading} style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

export default SignupForm;
