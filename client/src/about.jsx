import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported  
import myLogo from './assets/LOGOSALON1.png'; // Import your image here
import { GiCheckMark } from "react-icons/gi";
import './about.css'; // Import your CSS file here
import Jane from './assets/jane.jpg'; // Import your image here
import Kate from './assets/precious.jpg'; // Import your image here
import John from './assets/john.jpg'; // Import your image here

const About = () => {
  const [activeContent, setActiveContent] = useState('about');

  const showContent = (content) => {
    setActiveContent(content);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Simulate logging out (e.g., clear user data)
      // setUsers([]);
      // setAppointments([]);
      // setMessage('Logged out successfully!');
      
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
                  <Link className="nav-link" to="/home" onClick={() => showContent('home')}>Home</Link>
                </li>
                <li className="nav-item mx-4">
                  <Link className="nav-link active" aria-current="page" to="/about" onClick={() => showContent('about')}>About</Link>
                </li>
                <li className="nav-item mx-4">
                  <Link className="nav-link" to="/book" onClick={() => showContent('book')}>Book</Link>
                </li>
                <li className="nav-item mx-4">
                  <Link className="nav-link" to="/profile" onClick={() => showContent('profile')}>Profile</Link>
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

      {/* About Us Section */}
      <section className="about-us-wrapper" aria-labelledby="about-title" style={aboutSectionStyle}>
        <h1 id="about-title">Welcome to Soleil Beauty Salon</h1>
        <p className="section-description">
          Soleil Beauty Salon is your premier destination for luxurious beauty and wellness services. Since our founding, we have dedicated ourselves to delivering exceptional experiences that celebrate and enhance your natural beauty.
        </p>
        <p>
          Our professional team combines expert techniques, premium products, and personalized approaches to provide a wide range of services tailored just for you. At Soleil, we create more than just beauty treatments — we create moments of indulgence and confidence.
        </p>

        <h2>Our Vision</h2>
        <p>
          To be a sanctuary where beauty meets innovation, and every client’s confidence shines through radiant health and style.
        </p>

        <h2>Our Core Values</h2>
        <ul className="values-list" aria-label="Our Values">
          <li><GiCheckMark className='check'/><b>Customer-centric care:</b> prioritizing your comfort and desires.</li>
          <li><GiCheckMark className='check'/><b>Innovation:</b> keeping up with the latest beauty trends and technologies.</li>
          <li><GiCheckMark className='check'/><b>Quality:</b> using only the best products and techniques in the industry.</li>
          <li><GiCheckMark className='check'/><b>Integrity:</b> building trust through honesty and transparency.</li>
          <li><GiCheckMark className='check'/><b>Sustainability:</b>  committing to eco-friendly practices wherever possible.</li>
        </ul>

        <section className="team-section" aria-labelledby="team-title">
          <h2 id="team-title">Meet Our Team</h2>
          <div className="team-list" style={teamListStyle}>
            <div className="team-member" role="group" aria-label="Jane Doe, Lead Stylist" style={teamMemberStyle}>
              <div 
                className="team-photo" 
                style={teamPhotoStyle}
              ><img src={Jane} alt="" className='image'/></div>
              <div className="team-name" style={teamNameStyle}>Jane Philomela</div>
              <div className="team-title" style={teamTitleStyle}>Lead Stylist</div>
              <div className="team-bio" style={teamBioStyle}>
                With over 10 years of experience, Jane crafts styles that enhance your natural look and suit your personality perfectly.
              </div>
            </div>
            <div className="team-member" role="group" aria-label="Kate Sharma, Makeup Artist" style={teamMemberStyle}>
              <div
                className="team-photo"
                style={teamPhotoStyle}
              ><img src={Kate} alt="" className='image'/></div>
              <div className="team-name" style={teamNameStyle}>Kate Sharma</div>
              <div className="team-title" style={teamTitleStyle}>Makeup Artist</div>
              <div className="team-bio" style={teamBioStyle}>
                Kate excels in creating flattering looks for any occasion, from everyday glamour to special events.
              </div>
            </div>
            <div className="team-member" role="group" aria-label="John Smith, Skincare Specialist" style={teamMemberStyle}>
              <div 
                className="team-photo" 
                style={teamPhotoStyle}
              ><img src={John} alt="" className='image' /></div>
              <div className="team-name" style={teamNameStyle}>John Paul</div>
              <div className="team-title" style={teamTitleStyle}>Skincare Specialist</div>
              <div className="team-bio" style={teamBioStyle}>
                John combines passion and expertise to rejuvenate your skin with customized treatments tailored just for you.
              </div>
            </div>
          </div>
        </section>

        <div 
          className="call-to-action" 
          role="button" 
          tabIndex={0} 
          aria-pressed="false" 
          onClick={() => alert('Booking system coming soon!')}
          onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') alert('Booking system coming soon!'); }}
          style={callToActionStyle}
        >
          Book Your Appointment Now
        </div>

        <div className="social-icons" aria-label="Follow Soleil Beauty Salon on social media" style={socialIconsStyle}>
          <a href="#" title="Follow us on Facebook" aria-label="Facebook" style={socialIconLinkStyle}>
            <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={socialIconSvgStyle}>
              <path d="M22 12a10 10 0 10-11.49 9.87v-6.98H8v-2.89h2.5v-2.2c0-2.45 1.49-3.8 3.77-3.8 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.58v1.76h2.78l-.44 2.89h-2.34v6.98A10 10 0 0022 12z"/>
            </svg>
          </a>
          <a href="#" title="Follow us on Twitter" aria-label="Twitter" style={socialIconLinkStyle}>
            <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={socialIconSvgStyle}>
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.43.36a9.12 9.12 0 01-2.88 1.1A4.52 4.52 0 0016.57 0c-2.5 0-4.52 2.07-4.52 4.62 0 .36.04.7.12 1.03A12.94 12.94 0 013 2.15a4.5 4.5 0 00-.61 2.32 4.5 4.5 0 002.01 3.76 4.39 4.39 0 01-2.05-.57v.06A4.51 4.51 0 004.52 11a4.48 4.48 0 01-2.04.07 4.52 4.52 0 004.22 3.17 9 9 0 01-5.78 2.05A8.84 8.84 0 010 17.8 12.77 12.77 0 006.92 20c8.28 0 12.8-6.84 12.8-12.77 0-.19 0-.37-.01-.55A9.33 9.33 0 0023 3z"/>
            </svg>
          </a>
          <a href="#" title="Follow us on Instagram" aria-label="Instagram" style={socialIconLinkStyle}>
            <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={socialIconSvgStyle}>
              <path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9zm8.75 1a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="container">
        <footer className="py-3 my-4">
          <ul className="nav justify-content-center border-bottom pb-3 mb-3">
            <li className="nav-item"><Link className="nav-link text-body-secondary" to="/home" onClick={() => showContent('home')}>Home</Link></li>
            <li className="nav-item"><Link className="nav-link text-body-secondary" to="/book" onClick={() => showContent('book')}>Book</Link></li>
            <li className="nav-item"><Link className="nav-link text-body-secondary" to="/about" onClick={() => showContent('about')}>About Us</Link></li>
            <li className="nav-item"><Link className="nav-link text-body-secondary" to="/profile" onClick={() => showContent('profile')}>Profile</Link></li>
            <li className="nav-item"><Link className="nav-link text-body-secondary" to="/" onClick={handleLogout}>Logout</Link></li>
          </ul>
          <img src={myLogo} alt="Soleil" width={180} height={80} className='md-5' />
          <p className="text-center text-body-secondary">© 2025 Soleil Beauty Salon, Inc</p>
        </footer>
      </div>
    </div>
  )
};

// Inline CSS styles as JS objects for JSX styling

const aboutSectionStyle = {
  maxWidth: '1200px',
  backgroundColor: '#fff',
  borderRadius: '15px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  padding: '40px 50px',
  color: '#333',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const teamListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  marginTop: '30px',
};

const teamMemberStyle = {
  flex: '1 1 calc(33.333% - 20px)',
  backgroundColor: '#fef8f0',
  borderRadius: '12px',
  padding: '20px 15px',
  textAlign: 'center',
  boxShadow: '0 3px 10px rgba(216,126,6,0.15)',
  transition: 'transform 0.3s ease',
  cursor: 'default',
};

const teamPhotoStyle = {
  width: '110px',
  height: '110px',
  borderRadius: '50%',
  margin: '0 auto 15px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '0 5px 15px rgba(216,126,6,0.4)',
};

const teamNameStyle = {
  fontWeight: '700',
  fontSize: '1.15rem',
  color: '#d87e06',
  marginBottom: '6px',
};

const teamTitleStyle = {
  fontSize: '0.9rem',
  fontStyle: 'italic',
  color: '#777',
  marginBottom: '12px',
};

const teamBioStyle = {
  fontSize: '0.95rem',
  color: '#555',
};

const callToActionStyle = {
  marginTop: '60px',
  backgroundColor: '#d87e06',
  color: 'white',
  textAlign: 'center',
  fontSize: '1.3rem',
  padding: '25px 20px',
  borderRadius: '12px',
  fontWeight: '700',
  letterSpacing: '1.5px',
  cursor: 'pointer',
  userSelect: 'none',
  boxShadow: '0 5px 15px rgba(216,126,6,0.6)',
  transition: 'background-color 0.3s ease',
};

const socialIconsStyle = {
  marginTop: '30px',
  textAlign: 'center',
  color: '#d87e06',
};

const socialIconLinkStyle = {
  margin: '0 12px',
  display: 'inline-block',
  color: '#d87e06',
  transition: 'color 0.3s ease',
  textDecoration: 'none',
};

const socialIconSvgStyle = {
  width: '28px',
  height: '28px',
  verticalAlign: 'middle',
};

export default About;
