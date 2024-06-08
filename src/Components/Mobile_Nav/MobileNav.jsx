import React from 'react';
import './MobileNav.css';
import Navlogo from '../../static/logo_no_background.svg';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MobileNav = ({ text }) => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate('/');
  };
  return (
    <Container fluid>
      <div className='NavMobileLogo'>
        <div className='logoclick'>
          <img src={Navlogo} alt='Logo' onClick={handleLogoClick} />
        </div>
        <div className='mobile_textnav'>
          <span>{text}</span>
        </div>
      </div>
    </Container>
  );
};

export default MobileNav;
