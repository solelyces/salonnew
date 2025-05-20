import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import myLogo from './assets/LOGOSALON1.png';
import './book.css';
import Modal from 'react-modal';



const Book = ({ user_id }) => {
   const [userId, setUserId] = useState(null);
   console.log('Current user_id:', userId);
   

  useEffect(() => {
        const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      console.log('User data from localStorage in Book:', userData);
      setUserId(userData.user_id);
    } else {
      console.log('No user data found in localStorage');
    }
  }, []);
  
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/services');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = data.map(service => ({
          ...service,
          picture: service.Picture ? `data:image/jpeg;base64,${service.Picture}` : null,
          price: Number(service.price)
        }));
        setServices(formattedData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchPaymentOptions = async () => {
      try {
          const response = await fetch('http://localhost:3000/api/payment-options');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
              // Log the raw data to see property names
    console.log('Fetched payment options:', data);

    // If the ID property is different, map it:
    const formattedData = data.map((option, index) => ({
      ...option,
      paymentinfo_id: index+1, // adapt as needed
    }));
    setPaymentOptions(formattedData);
      } catch (error) {
          console.error("Error fetching payment options:", error);
      }
  };

    fetchServices();
    fetchPaymentOptions();
  }, [user_id]);

  const openModal = (service) => {
        if (!modalIsOpen) { // Prevent opening if already open
            setSelectedService(service);
            setModalIsOpen(true);
        }
    };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedService(null);
  };

  const addToBooking = () => {
    if (selectedService) {
      const existing = selectedServices.find(service => service.services_id === selectedService.services_id);
      if (!existing) {
        if (window.confirm(`Do you want to add ${selectedService.services_name} to your booking?`)) {
          setSelectedServices(prev => [...prev, selectedService]);
          alert(`${selectedService.services_name} added to booking.`);
          setConfirmationModalIsOpen(true);
        }
      } else {
        alert(`${selectedService.services_name} is already in the booking.`);
      }
      closeModal();
    }
  };

const confirmBooking = async () => {
  if (!selectedPayment) {
    alert("Please select a payment method.");
    return;
  }
  const selectedOption = paymentOptions.find(
    (option) => option.paymentdescription === selectedPayment
  );
  if (!selectedOption) {
    alert("Invalid payment method selected.");
    return;
  }
  const paymentId = selectedOption.paymentinfo_id;
 console.log('Selected payment info ID:', paymentId);
  if (window.confirm("Are you sure you want to confirm your booking for the selected services?")) {
    console.log('Selected Payment ID:', paymentId);
    console.log('Preparing to submit:', {
      user_id: userId,
      services_id: services.services_id, // Collect all service IDs
      paymentinfo_id: paymentId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      total: selectedServices.reduce((total, service) => total + service.price, 0), // Calculate total price
      status: 'Pending',
    });  
    try {
      for (const service of selectedServices) {
        const response = await fetch('http://localhost:3000/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            services_id: service.services_id,
            paymentinfo_id: paymentId,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            total: service.price,
            status: 'Pending',
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Error response:', error);
          throw new Error(`Error booking service: ${service.services_name}. ${error.message || 'No error message provided.'}`);
        }
      }
      alert('Services booked successfully!');
      setSelectedServices([]);
      setConfirmationModalIsOpen(false);
    } catch (error) {
      alert('There was a problem with your booking. Please try again later.');
      console.error(error);
    }
  }
};







  const removeService = (serviceId) => {
    if (window.confirm("Are you sure you want to remove this service from your booking?")) {
      setSelectedServices(prev => prev.filter(service => service.services_id !== serviceId));
    }
  };

  const closeConfirmationModal = () => {
    setConfirmationModalIsOpen(false);
  };

  const addMoreServices = () => {
    closeConfirmationModal();
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
    <div id="app">
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
                <Link className="nav-link active" aria-current="page" to="/book" onClick={() => showContent('book')}>Book</Link>
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

      <div id="Body">
        <h1>Our Services</h1>
        <p className="Body-P mb-3 p-3 px-lg-5">
        We offer a wide range of services tailored to meet your needs. Whether you're looking for relaxation, rejuvenation, or a unique experience, our trained professionals are here to assist you. Explore our services below and find the perfect fit for you!</p>
        <div className="gallery-container"> 
          {services.map((service) => (
            <div 
              key={service.services_id} 
              className="service-card"
              onClick={() => openModal(service)}
            >
              <img 
                src={service.picture} 
                alt={service.services_name}
              />
              <h3>{service.services_name}</h3>
              <p>Php {typeof service.price === 'number' ? service.price.toFixed(2) : 'Invalid Price'}</p>
              <p><i>Click</i></p>
            </div>
          ))}
        </div>
  
        {selectedService && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Service Details"
            className="Modal__Content"
            overlayClassName="Overlay"
             ariaHideApp={false}
          >
            <button onClick={closeModal} className="Modal__CloseButton">&times;</button>
            <h2 className="Modal__Title">{selectedService.services_name}</h2>
            <img src={selectedService.picture} alt={selectedService.services_name} className="Modal__Image" />
            <p className="Modal__DescriptionPrice">{`Price: Php ${selectedService.price.toFixed(2)}`}</p>
            <p><b>Description: </b></p>
            <p className="Modal__Description">{selectedService.Service_Description}</p>
            
            <button className="addToBook" onClick={addToBooking}>Add to Book</button>
          </Modal>
        )}
  
        {confirmationModalIsOpen && (
          <Modal
            isOpen={confirmationModalIsOpen}
            onRequestClose={closeConfirmationModal}
            contentLabel="Confirm Your Booking"
            className="Modal__ContentConfirmation"
            overlayClassName="Overlay"
            ariaHideApp={false}
                      >
            <button onClick={closeConfirmationModal} className="Modal__CloseButton">&times;</button>
            <h2>Your Selected Services</h2>
            <ul>
              {selectedServices.map(service => (
                <li key={service.services_id}>
                  {service.services_name} - Php {service.price.toFixed(2)}
                  <button className="Remove" onClick={() => removeService(service.services_id)}>Remove</button>
                  <br />
                </li>
              ))}
            </ul>
            <div className="form-group">
              <label htmlFor="appointmentDate">Select Appointment Date:</label>
              <input
                type="date"
                id="appointmentDate"
                className="form-control"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="appointmentTime">Select Appointment Time:</label>
              <input
                type="time"
                id="appointmentTime"
                className="form-control"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              />
            </div>
              <div className="form-group">
                <label htmlFor="paymentMethod">Select Payment Method:</label>
                  <select
                    id="paymentMethod"
                    className="form-control"
                    value={selectedPayment}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    required
                  >
                    <option value="">Select a payment method</option>
                    {paymentOptions.map((option) => (
                      <option key={option.paymentinfo_id} value={option.paymentdescription}>
                        {option.paymentdescription}
                      </option>
                    ))}
                  </select>
              </div>


            <div className="Modal__ButtonContainer">
              <button className="AddMoreServices" onClick={addMoreServices}>Add Services</button>
              <button className="Modal_Close" onClick={confirmBooking}>Confirm Booking</button>
            </div>
          </Modal>
        )}
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

export default Book;
