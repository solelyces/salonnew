import React, { useState, useEffect } from 'react';
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import myImage from './assets/girl.jpg'; // Import your image here
import myLogo from './assets/LOGOSALON1.png'; // Import your image here
import LoginForm from './login';

const Home = ({user}) => {
  const [activeContent, setActiveContent] = useState('home');
  
  useEffect(() => {
    if (user && user.username) {
      console.log(`User ${user.username} logged in.`);
    }
  }, [user]);
  
  const showContent = (content) => {
    setActiveContent(content);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Simulate logging out (e.g., clear user data)
      setUsers([]);
      setAppointments([]);
      setMessage('Logged out successfully!');
      
      // Redirect to the homepage (or login page)
      window.location.href = '/'; // Change this to your actual login page URL
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between w-100">
            <div className="d-flex flex-column flex-md-row align-items align-items-center">
              <a className="navbar-brand me-5" href="#">
                <img src={myLogo} alt="Soleil" width={180} height={80} className='ms-5'/>
              </a>
              <ul className="navbar-nav mb-2 mb-lg-0 d-flex flex-row me-3 ">
              <li className="nav-item mx-4">
                <Link className="nav-link active" aria-current="page" to="/home" onClick={() => showContent('home')}>Home</Link>
              </li>
              <li className="nav-item mx-4">
                <Link className="nav-link" to="/about" onClick={() => showContent('projects')}>About</Link>
              </li>
              <li className="nav-item mx-4">
                <Link className="nav-link" to="/book" onClick={() => showContent('book')}>Book</Link>
              </li>
              <li className="nav-item mx-4">
                <Link className="nav-link" to="/profile" onClick={() => showContent('about')}>Profile</Link>
              </li>
            </ul>
            </div>
            {/* Search form */}
            <form className="d-flex align-items-center my-2 me-5" role="search">
              <input
                className="form-control me-4"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Content Sections */}
      <div className={activeContent === 'home' ? 'content active' : 'content' } id="home" style={{ marginTop: '120px' }}>
        <div className="container my-5 margin-top-5 mt-5">
          <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg mt-5">
            <div className="col-lg-7 p-3 p-lg-5 pt-lg-3 mt-5">
              <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3 mt-5">
                Welcome to Soleil Salon
              </h1>
              <p className="lead mb-5">
                Salon Soleil is a luxurious salon experience that offers a wide range of services to help you look and feel your best. Whether you're looking for a haircut, color treatment, or a relaxing spa day, Salon Soleil has everything you need to indulge in self-care and pampering.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
                <button
                  type="button"
                  className="btn btn-primary btn-lg px-4"
                  onClick={() => showContent('projects')}
                >
                  Book Now
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg px-4"
                  onClick={() => showContent('contact')}
                >
                  Contact Us
                </button>
              </div>
            </div>
            <div className="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
              <img
                className="rounded-lg-3"
                src={myImage}
                alt="Profile"
                width="450"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
            <footer className="py-3 my-4">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item"><Link className="nav-link text-body-secondary" to="/home" onClick={() => showContent('home')}>Home</Link></li>
                    <li className="nav-item"><Link className="nav-link text-body-secondary" to="/book" onClick={() => showContent('book')}>Book</Link></li>
                    <li className="nav-item"><Link className="nav-link text-body-secondary" to="/about" onClick={() => showContent('about')}>About Us</Link></li>
                    <li className="nav-item"><Link className="nav-link text-body-secondary" to="/profile" onClick={() => showContent('profile')}>Profile</Link></li>
                    <li className="nav-item"><Link className="nav-link text-body-secondary" to="/" onClick={handleLogout}>Logout</Link></li>
                </ul>
                <img src={myLogo} alt="Soleil" width={180} height={80} className='md-5'/>
                <p className="text-center text-body-secondary">© 2025 Soleil Beauty Salon, Inc</p>
            </footer>
        </div>
    </div>
  );
};

export default Home;
