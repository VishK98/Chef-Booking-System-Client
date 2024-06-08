import React from 'react';
import logo from '../../src/static/logo_no_background.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Twitter from '../static/xtwitter.svg';
import Facebook from '../static/facebook.svg';
import Insta from '../static/instagram.svg';
import {
  faFacebook,
  faInstagram,
  // faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import './Footer.css';
import { Link } from 'react-router-dom';
// import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    // <Container fluid>
    <div className='footer'>
      <div className='footer-left-side'>
        <img src={logo} alt='Logo' className='App-logo-footer' />
        <h3 className='App-name-footer'>Chef on Wheelz</h3>
      </div>
      <div className='footer-middle-side'>
        <p>Privacy Policy | Cookies</p>
      </div>
      <div className='footer-right-side'>
        <Link
          to='https://www.facebook.com/profile.php?id=61557500464151'
          className='footer-links'
        >
          <img
            src={Facebook}
            style={{ width: '24px', height: '24px' }}
            alt='Instagram'
            className='instagram-icon'
          />
        </Link>
        <Link
          to='https://www.instagram.com/chefonwheelsz/'
          className='footer-links'
        >
          <img
            src={Insta}
            style={{ width: '24px', height: '24px' }}
            alt='Instagram'
            className='instagram-icon'
          />
        </Link>
        {/* <Link
          to='https://www.linkedin.com/company/chefonwheelz/'
          className='footer-links'
        >
          <FontAwesomeIcon icon={faLinkedin} size='2x' />
        </Link> */}
        <Link to='https://twitter.com/Chefonwheelsz' className='footer-links'>
          <img
            src={Twitter}
            style={{ width: '24px', height: '24px' }}
            alt='Twitter'
            className='twitter-icon'
          />
        </Link>
      </div>
    </div>
    // </Container>
  );
};

export default Footer;
