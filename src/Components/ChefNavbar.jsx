import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquareCheck,
  faCalendar,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import './ChefNavbar.css';
import { useNavigate } from 'react-router-dom';

const ChefNavbar = ({
  isChefLoggedIn,
  setIsChefLoggedIn,
  loggedInChefName,
  setLoggedInChefName,
}) => {
  const navigate = useNavigate();

  const handleClick = (pathname) => {
    navigate(pathname);
  };

  const renderNavItems = () => {
    return (
      <nav className='bottom-navbar'>
        {/* upcoming sessions */}
        <a
          className={`nav-item-session ${
            window.location.pathname === '/chef/sessions' ? 'active' : ''
          }`}
          onClick={() => handleClick('/chef/sessions')}
        >
          <FontAwesomeIcon
            icon={faCalendar}
            className={`icon ${
              window.location.pathname === '/chef/sessions' ? 'active' : ''
            }`}
          />
          <span>Upcoming</span>
        </a>

        {/* chef completed sessions */}
        <a
          className={`nav-item-session ${
            window.location.pathname === '/chef/completed' ? 'active' : ''
          }`}
          onClick={() => handleClick('/chef/completed')}
        >
          <FontAwesomeIcon
            icon={faSquareCheck}
            className={`icon ${
              window.location.pathname === '/chef/completed' ? 'active' : ''
            }`}
          />
          <span>Completed</span>
        </a>

        {/* chef profile */}
        <a
          className={`nav-item-account ${
            window.location.pathname === '/chef/profile' ? 'active' : ''
          }`}
          onClick={() => handleClick('/chef/profile')}
        >
          <FontAwesomeIcon
            icon={faUser}
            className={`icon ${
              window.location.pathname === '/chef/profile' ? 'active' : ''
            }`}
          />
          <span>Account</span>
        </a>
        <a
          className={`nav-item-onboarding ${
            window.location.pathname === '/chef/on-boarding' ? 'active' : ''
          }`}
          onClick={() => handleClick('/chef/on-boarding')}
        >
          <FontAwesomeIcon
            icon={faUser}
            className={`icon ${
              window.location.pathname === '/chef/on-boarding' ? 'active' : ''
            }`}
          />
          <span>OnBoarding</span>
        </a>
      </nav>
    );
  };

  return <>{renderNavItems()}</>;
};

export default ChefNavbar;
