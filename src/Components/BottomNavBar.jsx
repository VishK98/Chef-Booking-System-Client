// import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import './BottomNavBar.css';
import { useNavigate } from 'react-router-dom';
import buttomsearch from '../../src/static/search-lg-mobile.svg';
// import SearchBar from '../../src/Components/SearchBar';
// import Buttomsearch from './Buttomsearch';

const BottomNavbar = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  const navigate = useNavigate();

  const handleClick = (pathname) => {
    navigate(pathname);
  };

  const handleHomeActive = () => {
    const pathname = window.location.pathname;
    if (pathname === '/' || pathname === '/home' || pathname === '/booking') {
      return 'active';
    } else if (pathname.startsWith('/chefs-by-cuisine/')) {
      return 'active';
    }
  };
  const renderNavItems = () => {
    return (
      <nav className='bottom-navbar'>
        <a
          className={`nav-item-house ${handleHomeActive()}`}
          onClick={() => handleClick('/')}
        >
          <FontAwesomeIcon
            icon={faHouse}
            className={`icon ${handleHomeActive()}`}
          />
          <span>Home</span>
        </a>
        <a
          className={`nav-item-session ${
            window.location.pathname === '/usersessions' ? 'active' : ''
          }`}
          onClick={() => handleClick('/usersessions')}
        >
          <FontAwesomeIcon
            icon={faCalendar}
            className={`icon ${
              window.location.pathname === '/usersessions' ? 'active' : ''
            }`}
          />
          <span>Sessions</span>
        </a>

        {/* <Buttomsearch /> */}

        <a
          className={`nav-item-search ${
            window.location.pathname === '/' ? '' : ''
          }`}
          onClick={() => handleClick('/')}
        >
          <img src={buttomsearch} alt='buttomsearch' />
          <span>Search</span>
        </a>
        <a
          className={`nav-item-account ${
            window.location.pathname === '/profile' ? 'active' : ''
          }`}
          onClick={() => handleClick('/profile')}
        >
          <FontAwesomeIcon
            icon={faUser}
            className={`icon ${
              window.location.pathname === '/profile' ? 'active' : ''
            }`}
          />
          <span>Account</span>
        </a>
      </nav>
    );
  };

  return <>{renderNavItems()}</>;
};

export default BottomNavbar;
