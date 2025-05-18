import React, { useState, useEffect } from 'react';
import { Link, BrowserRouter as Router, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import myLogo from './assets/LOGOSALON1.png';
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsWallet2 } from "react-icons/bs";
import { FaRegStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import './profile.css';
import profile from './assets/profile.jpg';

const Profile = () => {
  const [activeContent, setActiveContent] = useState('profile');
  const [user, setUser] = useState(null);
  const userId = 22;
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/api/transactions?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        if (Array.isArray(data)) {
          setBookings(data);
        } else if (data && Array.isArray(data.data)) {
          setBookings(data.data);
        } else {
          setBookings([]);
        }
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  }, [userId]);

  const showContent = (content) => {
    setActiveContent(content);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate('/');
    }
  };

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between w-100">
            <div className="d-flex flex-column flex-md-row align-items align-items-center">
              <a className="navbar-brand me-5" href="#">
                <img src={myLogo} alt="Soleil" width={180} height={80} className='ms-5'/>
              </a>
              <ul className="navbar-nav mb-2 mb-lg-0 d-flex flex-row me-3 ">
                <li className="nav-item mx-4">
                  <Link className="nav-link" to="/home" onClick={() => showContent('home')}>Home</Link>
                </li>
                <li className="nav-item mx-4">
                  <Link className="nav-link" to="/about" onClick={() => showContent('projects')}>About</Link>
                </li>
                <li className="nav-item mx-4">
                  <Link className="nav-link" to="/book" onClick={() => showContent('book')}>Book</Link>
                </li>
                <li className="nav-item mx-4">
                  <Link className="nav-link active" aria-current="page" to="/profile" onClick={() => showContent('about')}>Profile</Link>
                </li>
              </ul>
            </div>
            <form className="d-flex align-items-center my-2 me-5" role="search">
              <input className="form-control me-4" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>

      <div className="inside">
        <div className="inner col-lg-3 col-md-4 col-sm-12 col-12">
          <div className="profile-menu collapse d-lg-block" id="profileMenu">
            <div className="user-info" data-aos="fade-right">
              <div className="user-avatar">
                <img src={profile} alt="Profile" loading="lazy" />
                <span className="status-badge"><i className="bi bi-shield-check"></i></span>
              </div>
              <h4>{user?.name || "Guest"}</h4>
              <div className="user-status">
                <i className="bi bi-award"></i>
                <span>Active Member</span>
              </div>
            </div>

            <nav className="menu-nav">
              <ul className="nav flex-column" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" data-bs-toggle="tab" href="#orders">
                    <BsBoxSeam className='icons'/>
                    <span>My Appointments</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#wishlist">
                    <IoMdHeartEmpty className='icons'/>
                    <span>Wishlist</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#wallet">
                    <BsWallet2 className='icons'/>
                    <span>Payment Methods</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#reviews">
                    <FaRegStar className='icons'/>
                    <span>My Reviews</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#addresses">
                    <IoLocationOutline className='me-2 icons'/>
                    <span>Addresses</span>
                  </a>
                </li>
                <li className="nav-item border-bottom pb-4">
                  <a className="nav-link " data-bs-toggle="tab" href="#settings">
                    <IoSettingsOutline className='icons'/>
                    <span>Account Settings</span>
                  </a>
                </li>
                <li className="nav-item" id='logout'>
                  <a className="nav-link" data-bs-toggle="tab" href="#logout" onClick={handleLogout}>
                    <IoIosLogOut className='icons' color='red'/>
                    <span><b>Logout</b></span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="receipt-box-custom col-lg-8">
          <h3 className='title'>My Appointments</h3>
          {Array.isArray(bookings) ? (
            bookings.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <div className="all-bookings-container">
                {bookings.map((booking, index) => (
                  <div key={index} className="receipt">
                    <h4 className='border-bottom mb-4 pb-3'>Book No: {booking.recordID}</h4>
                    <h5>Services Acquired:</h5>
                    <div className="services-list">
                      <div className="service-item">
                        <span className="service-name">{booking.services_name}</span>
                        <span className="service-price">${Number(booking.total).toFixed(2)}</span>
                        <div className="service-actions">
                          <button className="btn-edit" onClick={() => handleEditService(booking.id, index)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDeleteService(booking.id, index)}>Delete</button>
                        </div>
                      </div>
                    </div>
                    <p className="total-payment">
                      <strong>
                        Total Payable: $
                        {isNaN(Number(booking.total)) ? '0.00' : Number(booking.total).toFixed(2)}
                      </strong>
                    </p>
                    <h5 className="booking-date">Booking Date:</h5>
                    <div className="booking-item">
                      <span className="booking-name">{booking.Date}</span>
                      <div className="booking-actions">
                        <button className="btn-edit" onClick={() => handleEditBookingDate(booking.id, index)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeletebookingDate(booking.id, index)}>Delete</button>
                      </div>
                    </div>
                    <h5 className="booking-time">Booking Time:</h5>
                    <div className="booking-item">
                      <span className="booking-name">{booking.Time}</span>
                      <div className="booking-actions">
                        <button className="btn-edit" onClick={() => handleEditBookingTime(booking.id, index)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeletebookingTime(booking.id, index)}>Delete</button>
                      </div>
                    </div>
                    <div className="payment-method">
                      <span>Payment Method: <b>{booking.paymentdescription}</b></span>
                      <div className="payment-actions">
                        <button className="btn-edit" onClick={() => handleEditPaymentMethod(booking.id)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeletePaymentMethod(booking.id)}>Delete</button>
                      </div>
                    </div>
                    <div className={`status-label ${booking.status.toLowerCase()}`}>
                      Status: {booking.status}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p>Loading bookings...</p>
          )}
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

export default Profile;
