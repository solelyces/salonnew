
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
import './profile.css';
import profile from './assets/profile.jpg';
import Modal from 'react-modal';

const Profile = () => {
  const [activeContent, setActiveContent] = useState('profile');
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

const [editModalOpen, setEditModalOpen] = useState(false);
const [currentBooking, setCurrentBooking] = useState(null);
const [editServices, setEditServices] = useState([]);
const [editDate, setEditDate] = useState('');
const [editTime, setEditTime] = useState('');
const [editPayment, setEditPayment] = useState('');
const [recentAppointments, setRecentAppointments] = useState([]);
const [activeTab, setActiveTab] = useState('myAppointments');
const [totalPending, setTotalPending] = useState(0);
const [editTotal, setEditTotal] = useState(0);


  console.log('User:', user);
  console.log('Bookings:', bookings);

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
    if (user && user.user_id) {
    fetch(`http://localhost:3000/api/client/transactions-pending?user_id=${user?.user_id}`)
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
    }
  }, [user]);

  const showContent = (content) => {
    setActiveContent(content);
  };

const servicesOptions = [
  { services_id: 1, services_name: 'Hair Color' , services_price: 200 },
  { services_id: 2, services_name: 'Hair Cut' , services_price: 80},
  { services_id: 3, services_name: 'Hair Rebond' , services_price: 1500 },
  { services_id: 4, services_name: 'Nail Gel' , services_price: 200},
  { services_id: 5, services_name: 'Nail Polish' , services_price: 150},
  { services_id: 6, services_name: 'Nail Color' , services_price: 200},
];  

const paymentOptions = [
  { paymentinfo_id: 1, paymentdescription: 'Gcash'},
  { paymentinfo_id: 2, paymentdescription: 'Paymaya' },
  { paymentinfo_id: 3, paymentdescription: 'Master Card' },
  { paymentinfo_id: 4, paymentdescription: 'Visa' },
  { paymentinfo_id: 5, paymentdescription: 'Cash at Salon' },
];

const [profileData, setProfileData] = useState({
  username: '',
  firstName: '',
  lastName: '',
  displayName: '',
  email: '',
  phone: '',
  theme: 'light', // or 'dark'
  language: 'en', // default language
  notifications: true,
  privacy: 'public' // or 'private'
});


const [isEditingProfile, setIsEditingProfile] = useState(false);
const [editProfileForm, setEditProfileForm] = useState({
  firstname: '',
  lastname: '',
  email: '',
  username: ''
});

// Populate form fields when entering edit mode
const handleEditProfile = () => {
  setEditProfileForm({
    firstname: profileData.firstName,
    lastname: profileData.lastName,
    email: profileData.email,
    username: user?.username || ''
  });
  setIsEditingProfile(true);
};

// Handle form input change
const handleProfileInputChange = (field, value) => {
  setEditProfileForm(prev => ({ ...prev, [field]: value }));
};

// Handle saving the profile info



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

const handleEdit = (booking) => {
  if (editModalOpen) return;
  setCurrentBooking(booking);

  // Since services_id is an int, filter directly
  const selectedServices = servicesOptions.find(
    s => s.services_id === booking.services_id
  );
  setEditServices(selectedServices ? [selectedServices] : []);
    // Calculate initial total
  setEditTotal(Number(booking.total));
  setEditDate(formatDate(booking.Date));
  setEditTime(formatTime(booking.Time));
  setEditPayment(booking.paymentinfo_id);
  setEditModalOpen(true);
};

const handleSaveEdit = () => {
  if (!currentBooking) return;
  
   const services_id = editServices.map(s => s.services_id); 
  fetch(`http://localhost:3000/api/update-transaction`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recordID: currentBooking.recordID,
      services_id: editServices.map(s => s.services_id), // array of IDs or comma-separated string
      Date: editDate,
      Time: editTime,
      total: editTotal,
      paymentinfo_id: editPayment,
    }),
  })
    .then(res => res.json())
    .then(data => {
      alert('Booking updated successfully!');
      fetchBookings(); // Refresh bookings
      setEditModalOpen(false);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to update booking.');
    });
};

const fetchBookings = () => {
  if (user && user.user_id) {
    fetch(`http://localhost:3000/api/client/transactions-pending?user_id=${user?.user_id}`)
      .then(res => res.json())
      .then(data => {
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
  }
};

useEffect(() => {
  // existing fetch bookings code...
  fetchBookings();

  // fetch total pending payments
  if (user && user.user_id) {
    fetch(`http://localhost:3000/api/client/total-pending?user_id=${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        setTotalPending(data.totalPending || 0);
      })
      .catch(err => console.error('Error fetching total pending:', err));
  }
}, [user]);



const fetchRecentConfirmed = () => {
  if (user && user.user_id) {
    fetch(`http://localhost:3000/api/client/transactions-paid?user_id=${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        setRecentAppointments(data); // data is already filtered for 'confirmed'
      })
      .catch(error => {
        console.error('Error fetching recent appointments:', error);
      });
  }
};


function handleDelete(booking) {
  if (confirm(`Are you sure you want to delete appointment record ${booking.recordID}?`)) {
    fetch('http://localhost:3000/transactions/delete-by-record', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recordID: booking.recordID,
        user_id: user.user_id
      })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      fetchBookings(); // refresh list
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Failed to delete appointment.");
    });
  }
}
const handleProfileSave = () => {
  fetch(`http://localhost:3000/api/users/${user.user_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: editProfileForm.username,
      firstname: editProfileForm.firstname,
      lastname: editProfileForm.lastname,
      email: editProfileForm.email,
    }),
  })
  .then(res => {
    if (res.ok) {
      // If response status is 204 No Content, no body
      if (res.status === 204) {
        alert('Profile updated successfully!');
        // Update local user state here if needed
        setUser(prev => ({ ...prev, ...editProfileForm }));
        localStorage.setItem('user', JSON.stringify({ ...prev, ...editProfileForm }));
        return; // No body to parse
      }
      // For other successful responses, response might be plain text
      return res.text();
    } else {
      // Handle error responses
      return res.text().then(text => {
        throw new Error(text || 'Update failed');
      });
    }
  })
  .then(data => {
    if (data) {
      // If backend returns a message like "User updated successfully"
      alert(data);
    }
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Error updating profile: ' + err.message);
  });
};

useEffect(() => {
  if (user && user.user_id) {
    fetch(`http://localhost:3000/api/users/${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        // Populate profileData with the fetched data
        setProfileData(prev => ({
          ...prev,
          firstName: data.firstname || '',
          lastName: data.lastname || '',
          email: data.email || '',
          username: data.username || '',
        }));
      })
      .catch(err => {
        console.error('Error fetching user profile:', err);
      });
  }
}, [user]);

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
          <div className="profile-menu" id="profileMenu">
            <div className="user-info" data-aos="fade-right">
              <div className="user-avatar">
                <img src={profile} alt="Profile" loading="lazy" />
                <span className="status-badge"><i className="bi bi-shield-check"></i></span>
              </div>
              <h4>{user?.username || "Guest"}</h4>
              <div className="user-status">
                <i className="bi bi-award"></i>
                <span>Active Member</span>
              </div>
            </div>

            <nav className="menu-nav">
              <ul className="nav" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'myAppointments' ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      showContent('profile'); // optional, if you still want to show other content
                      setActiveTab('myAppointments');
                    }}
                  >
                    <BsBoxSeam className='icons' />
                    <span>My Appointments</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'recentAppointments' ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      showContent('profile'); // optional
                      fetchRecentConfirmed(); // fetch only confirmed
                      setActiveTab('recentAppointments');
                    }}
                  >
                    <IoMdHeartEmpty className='icons' />
                    <span>Recent Appointments</span>
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
                <li className="nav-item border-bottom pb-4">
                  <a
                    className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setActiveTab('settings');
                    }}
                  >
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
          <h3 className='title'>My Profile</h3>
           {activeTab === 'myAppointments' && (
              <>
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
                        <span className="service-price">Php {Number(booking.total).toFixed(2)}</span>
                      </div>
                    </div>
                    <h5 className="booking-date">Booking Date:</h5>
                    <div className="booking-item">
                      <span className="booking-name">{formatDate(booking.Date)}</span>
                    </div>
                    <h5 className="booking-time">Booking Time:</h5>
                    <div className="booking-item">
                      <span className="booking-name">{formatTime(booking.Time)}</span>
                    </div>
                    <div className="payment-method">
                      <span>Payment Method: <b>{booking.paymentdescription}</b></span>
                    </div>
                    <div className="status-container">
                      <div className={`status-label ${booking.status.toLowerCase()}`}>
                        Status: {booking.status}
                      </div>
                    </div>
                    <div className="action-buttons" style={{ marginTop: '10px' }}>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(booking)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn btn btn-danger btn-sm"
                        onClick={() => handleDelete(booking)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p>Loading bookings...</p>
          )}
           <div className="total-payments-section mt-4 p-3 border rounded bg-light">
            <div className='inside-total-payments'>
            <h5><BsWallet2 className='icons' size={20} />Total Pending Payments:</h5>
            <p className="fs-4">Php {Number(totalPending).toFixed(2)}</p>
            </div>
            
          </div>
          </>
           )}

          {editModalOpen && (
            <Modal
              isOpen={editModalOpen}
              onRequestClose={() => setEditModalOpen(false)}
              contentLabel="Edit Booking"
              className="Modal__ContentProfile"
              overlayClassName="OverlayProfile" 
              ariaHideApp={false}
            >
              <button onClick={() => setEditModalOpen(false)} className="Modal__CloseButtonProfile">×</button>
              <h2>Edit Booking</h2>
                <select
                  id="editServices"
                  className="form-control"
                  value={editServices.length > 0 ? editServices[0].services_id : ''}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const selectedSvc = servicesOptions.find(s => s.services_id === selectedId);
                    if (selectedSvc) {
                      setEditServices([selectedSvc]);
                      setEditTotal(selectedSvc.services_price);
                    }
                  }}
                >
                  {servicesOptions.map((svc) => (
                    <option key={svc.services_id} value={svc.services_id}>
                      {svc.services_name}
                    </option>
                  ))}
                </select>
                  <div>
                    <strong>Price: </strong> Php {editTotal.toFixed(2)}
                  </div>
              {/* Date */}
              <div className="form-group">
                <label htmlFor="editDate">Date:</label>
                <input
                  type="date"
                  id="editDate"
                  className="form-control"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              {/* Time */}
              <div className="form-group">
                <label htmlFor="editTime">Time:</label>
                <input
                  type="time"
                  id="editTime"
                  className="form-control"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              </div>
              {/* Payment Method */}
              <div className="form-group">
                <label htmlFor="editPayment">Payment Method:</label>
                <select
                  id="editPayment"
                  className="form-control"
                  value={editPayment}
                  onChange={(e) => setEditPayment(e.target.value)}
                >
                  <option value="">Select Payment Method</option>
                  {paymentOptions.map((option) => (
                    <option key={option.paymentinfo_id} value={option.paymentinfo_id}>
                      {option.paymentdescription}
                    </option>
                  ))}
                </select>
              </div>
              {/* Save Button */}
              <button
                className="saveButton btn btn-success mt-3"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </Modal>
          )}

          {activeTab === 'recentAppointments' && (
            <>
            <h3 className='title'>Recent Appointments</h3>
          {recentAppointments.length > 0 && (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Username</th>
                  <th>Service Name</th>
                  <th>Payment Description</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appt) => (
                  <tr key={appt.recordID}>
                    <td>{appt.recordID}</td>
                    <td>{user?.username || 'Guest'}</td>
                    <td>{appt.services_name}</td>
                    <td>{appt.paymentdescription}</td>
                    <td>{appt.Date}</td>
                    <td>{appt.Time}</td>
                    <td>${Number(appt.total).toFixed(2)}</td>
                    <td>{appt.status}</td>
                    <td>
                      {/* Optional: Add actions like Edit/Delete */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
            </>
          )}
{activeTab === 'settings' && (
  <div className="settings-form mt-4 p-3 border rounded bg-light">
    <h3>Account Settings</h3>
    {!isEditingProfile ? (
      <div>
        <p>
          <strong>Username:</strong> {user?.username}
        </p>
            <p><strong>First Name:</strong> {profileData.firstName}</p>
            <p><strong>Last Name:</strong> {profileData.lastName}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
        <button className="btn btn-primary" onClick={handleEditProfile}>
          Edit Profile Information
        </button>
      </div>
    ) : (
      <div>
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">First Name</label>
            <input
              type="text"
              id="firstname"
              className="form-control"
              value={editProfileForm.firstname}
              onChange={(e) => handleProfileInputChange('firstname', e.target.value)}
            />
        </div>
        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">Last Name</label>
          <input
            type="text"
            id="lastname"
            className="form-control"
            value={editProfileForm.lastname}
            onChange={(e) => handleProfileInputChange('lastname', e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={editProfileForm.username}
            onChange={(e) => handleProfileInputChange('username', e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={editProfileForm.email}
            onChange={(e) => handleProfileInputChange('email', e.target.value)}
          />
        </div>
          <button
            type="button"
            className="btn btn-success"
            onClick={(e) => { e.preventDefault(); handleProfileSave(); }}
          >
            Save Changes
          </button>
        <button className="btn btn-secondary ms-2" onClick={() => setIsEditingProfile(false)}>Cancel</button>
        
      </div>
    )}
     {/* Display Preferences */}
              <div className="mb-3 mt-4">
                <label htmlFor="theme" className="form-label">Theme</label>
                <select
                  id="theme"
                  className="form-select"
                  value={profileData.theme}
                  onChange={(e) => setProfileData({ ...profileData, theme: e.target.value })}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="language" className="form-label">Language</label>
                <select
                  id="language"
                  className="form-select"
                  value={profileData.language}
                  onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  {/* Add more languages as needed */}
                </select>
              </div>
              
              {/* Notification toggle */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="notifications"
                  checked={profileData.notifications}
                  onChange={(e) => setProfileData({ ...profileData, notifications: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="notifications">
                  Enable Notifications
                </label>
              </div>
  </div>
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
