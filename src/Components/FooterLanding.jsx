import React from 'react';
import logo from '../../src/static/Logo-animation-landing.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import './FooterLanding.css';

const Footer = () => {
  return (
    <div className='footer-landing'>
      <div className='footer-left-side-landing'>
        <img src={logo} alt='Logo' className='App-logo-footer-landing' />
        <h3 className='App-name-footer-landing'>Chef on Wheelz</h3>
      </div>
      <div className='footer-middle-side-landing'>
        <p>Privacy Policy | Cookies</p>
      </div>
      <div className='footer-right-side-landing'>
        <FontAwesomeIcon icon={faFacebook} size='2x' />
        <FontAwesomeIcon icon={faInstagram} size='2x' />
        <FontAwesomeIcon icon={faLinkedin} size='2x' />
      </div>
    </div>
  );
};

export default Footer;
