import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Client');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!username || !password) {
      setMessage('Please enter username and password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
        role,
      });
      console.log('Login response:', response);

      if (response.status === 200) {
         const { user } = response.data;
         const userData = {
          username: user.username,  // Or: response.data.username
          role: user.role,
          user_id: user.user_id      // This should ideally come from the backend
        };

        // ✅ Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        console.log('User data stored in localStorage:', userData);
        setMessage('Login successful!');
        alert(`Welcome Back, ${userData.username}!`);

        onLoginSuccess(userData); // Optional if you're using lifting state
        navigate(role === 'Admin' ? '/admin' : '/home');
      } else {
        setMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setMessage('Invalid username or password');
        } else if (error.response.status === 403) {
          setMessage('Invalid role');
        } else {
          setMessage('Error connecting to server');
        }
      } else {
        setMessage('Error connecting to server');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const styles = {
    form: {
      maxWidth: '400px',
      margin: '15rem auto',
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
      marginTop: '50px',
      width: '50%',
      padding: '8px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: 'black',
      color: 'white',
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

  return (
    <form onSubmit={handleLogin} style={styles.form}>
      {/* Back Icon */}
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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBack();
          }
        }}
      >
        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>

      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={styles.input}
      /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      /><br />

      <label>
        Role:
        <select value={role} onChange={e => setRole(e.target.value)} style={styles.input}>
          <option>Admin</option>
          <option>Client</option>
        </select>
      </label><br />

      <button
        type="submit"
        disabled={loading}
        style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </form>
  );
}

export default LoginForm;
