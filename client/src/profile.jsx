
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
  { services_id: 1, services_name: 'Hair Color' },
  { services_id: 2, services_name: 'Hair Cut' },
  { services_id: 3, services_name: 'Hair Rebond' },
  { services_id: 4, services_name: 'Nail Gel' },
  { services_id: 5, services_name: 'Nail Gel' },
  { services_id: 6, services_name: 'Nail Gel' },
];  

const paymentOptions = [
  { paymentinfo_id: 1, paymentdescription: 'Gcash' },
  { paymentinfo_id: 2, paymentdescription: 'Paymaya' },
  { paymentinfo_id: 3, paymentdescription: 'Master Card' },
  { paymentinfo_id: 4, paymentdescription: 'Visa' },
  { paymentinfo_id: 5, paymentdescription: 'Cash at Salon' },
];

const handleEdit = (booking) => {
   if (editModalOpen) {
    // Modal is already open, optionally do nothing or close first
    return;
  }
  setCurrentBooking(booking);
  
  // Safely parse services_id: handle both array and string
  let servicesIds = [];
  if (Array.isArray(booking.services_id)) {
    servicesIds = booking.services_id;
  } else if (typeof booking.services_id === 'string') {
    servicesIds = booking.services_id.trim() === '' ? [] : booking.services_id.split(',').map(id => parseInt(id));
  } else {
    servicesIds = [];
  }
  
  // Now filter the services based on IDs
  const selectedServices = servicesOptions.filter(s => servicesIds.includes(s.services_id));
  setEditServices(selectedServices);
  setEditDate(booking.Date);
  setEditTime(booking.Time);
  setEditPayment(booking.paymentinfo_id);
  setEditModalOpen(true);
};

const handleSaveEdit = () => {
  if (!currentBooking) return;
  
   const services_id = editServices.length > 0 ? editServices[0].services_id : null; 
  fetch(`http://localhost:3000/api/update-transaction`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recordID: currentBooking.recordID,
      services_id: services_id, // array of IDs or comma-separated string
      Date: editDate,
      Time: editTime,
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
  fetchBookings();
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
              <h4>{user?.username || "Guest"}</h4>
              <div className="user-status">
                <i className="bi bi-award"></i>
                <span>Active Member</span>
              </div>
            </div>

            <nav className="menu-nav">
              <ul className="nav flex-column" role="tablist">
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
          <h2 className='text-center'>Welcome to your Profile</h2>
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
                        <span className="service-price">${Number(booking.total).toFixed(2)}</span>
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
                    </div>
                    <h5 className="booking-time">Booking Time:</h5>
                    <div className="booking-item">
                      <span className="booking-name">{booking.Time}</span>
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
              {/* Services (for simplicity, you might want a multi-select or checkboxes) */}
              {/* Services (for simplicity, you might want a multi-select or checkboxes) */}
                <div className="form-group">
                  <label htmlFor="editServices">Services:</label>
                  <select
                    id="editServices"
                    className="form-control"
                    single
                    value={editServices.map(s => s.services_id.toString())} // convert to strings for value matching
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions);
                      const selectedIds = selectedOptions.map(opt => parseInt(opt.value));
                      const selectedSvcObjs = servicesOptions.filter(s => selectedIds.includes(s.services_id));
                      setEditServices(selectedSvcObjs);
                    }}
                  >
                    {servicesOptions.map((svc) => (
                      <option key={svc.services_id} value={svc.services_id.toString()}>
                        {svc.services_name}
                      </option>
                    ))}
                  </select>
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
