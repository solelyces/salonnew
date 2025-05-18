import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from "react-router-dom";
import myLogo from './assets/LOGOSALON1.png'; 

const Homepage = () => {
  const containerStyle = {
    textAlign: 'center',
    borderRadius: '1rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f8f9fa',
    width: '50%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8rem',

  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  const paragraphStyle = {
    marginBottom: '5rem',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderRadius: '0.5rem',
  };

  const outlineInfoButtonStyle = {
    ...buttonStyle,
    border: '2px solid #17a2b8',
    color: '#17a2b8',
    backgroundColor: 'transparent',
  };

  const outlineDarkButtonStyle = {
    ...buttonStyle,
    border: '2px solid #343a40',
    color: '#343a40',
    backgroundColor: 'transparent',
  };

  

  return (
    <div>
      <div style={containerStyle}>
        <div style={{ padding: '5rem 0' }}>
           <img src={myLogo} alt="Soleil" width={180} height={80} className='my-4'/>
          <h1 style={headingStyle}>Welcome to Soleil Beauty Salon</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <p style={paragraphStyle}>
              Salon Soleil is a luxurious salon experience that offers a wide range of services to help you look and feel your best. Whether you're looking for a haircut, color treatment, or a relaxing spa day, Salon Soleil has everything you need to indulge in self-care and pampering.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button type="button" style={outlineInfoButtonStyle}>
                <Link to="/login" style={{ textDecoration: 'none', color: '#17a2b8' }}>Login</Link>
              </button>
              <button type="button" style={outlineDarkButtonStyle}>
                <Link to="/signup" style={{ textDecoration: 'none', color: '#343a40' }}>Sign Up</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Homepage;
