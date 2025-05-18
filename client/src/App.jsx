import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './login.jsx'
import Signup from './signup.jsx'
import HomePage from './homepage.jsx'
import Home from './home.jsx'
import AdminDashboard from './admin.jsx'
import Book from './book.jsx'
import Profile from './profile.jsx'
import  About from './about.jsx'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './book.css'
import './profile.css'
import './about.css'

function App() {
  const [user, setUser ] = useState(null); // State to manage logged-in user
  const handleLoginSuccess = (userData) => {
    console.log('User logged in:', userData);
    setUser (userData ); // Update user state on successful login
  };

 

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home user={user}/>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/logout" element={<HomePage />} />
          <Route path="/book" element={<Book />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
