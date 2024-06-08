import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserNavBar.css';
import logo from '../../static/logo_no_background.svg';
import Ballicon from '../../static/baill-icon.svg';
import axios from 'axios';

import UserLoginForm from '../UserLoginWeb/UserLoginForm';
import AddressAutosuggest from '../AddressAutoSuggest';
import SearchBar from '../SearchBar';
import BecomeAchef from '../BecomeAchef';
import userlogo from '../../static/togale-btn.svg';
import { Container, Spinner } from 'react-bootstrap';

const UserNavBar = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  const [currentLocation, setCurrentLocation] = useState('Detect my location');
  const [showLogInForm, setShowLogInForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleUserLogin = () => {
    // if (!isLoggedIn) {
    //   setShowLogInForm(!showLogInForm);
    // }
    navigate('/login', { state: { path: window.location.pathname } });
  };

  const handleLogout = async () => {
    setShowLoader(true);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cowToken')}`,
          },
        }
      )
      .then((response) => {
        localStorage.removeItem('cowToken');
        localStorage.removeItem('cowTokenExpiration');
        localStorage.removeItem('cowUserName');
        setShowDropdown(false);
        setShowLogInForm(false);
        setIsLoggedIn(false);
        setLoggedInUserName('');
        setShowLoader(false);
        navigate('/');
      })
      .catch((err) => {
        setShowLoader(false);
        console.log(err);
      });
  };

  const getLocationFromIp = async () => {
    try {
      const response = await axios.get('https://ipapi.co/json/');
      const { city, country } = response.data;
      const userLocation = `${city}, ${country}`;
      setCurrentLocation(userLocation);
    } catch (error) {
      console.error('Error fetching location data:', error);
      setCurrentLocation('Detect my Location');
    }
  };

  useEffect(() => {
    getLocationFromIp();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('cowToken');
    const expirationTime = localStorage.getItem('cowTokenExpiration');

    if (token && expirationTime) {
      const currentTime = new Date();
      if (currentTime < new Date(expirationTime)) {
        setIsLoggedIn(true);
        setLoggedInUserName(localStorage.getItem('cowUserName'));
      } else {
        localStorage.removeItem('cowToken');
        localStorage.removeItem('cowTokenExpiration');
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const visitProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  return (
    <Container fluid>
      <div className='user-header'>
        <div className='left'>
          <div className='logo-wrap'>
            <img
              src={logo}
              alt='Logo'
              className='logo'
              onClick={handleLogoClick}
            />
            <h3 className='app-name' onClick={handleLogoClick}>
              Chef on Wheelz
            </h3>
          </div>
        </div>
        <div className='autosuggestandsearch'>
          <AddressAutosuggest />
          <div className='vertical-line'></div>
          <SearchBar />
        </div>
        <div className='right'>
          <div className='user-info-and-become-chef-wrap'>
            <div className='becomachefpart'>
              <BecomeAchef />
            </div>
            <div className='bell-icon'>
              <img src={Ballicon} alt='Ballicon' />
            </div>
            {isLoggedIn ? (
              <div className='user-info dropdown' ref={dropdownRef}>
                &nbsp; &nbsp;
                <img
                  src={userlogo}
                  className='Userdropdown-icon dropbtnUser'
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    width: '84px',
                    height: '40px',
                  }}
                  alt='userlogo'
                />
                <div
                  id='myDropdown'
                  className={`dropdown-content ${showDropdown ? 'show' : ''}`}
                >
                  <p onClick={visitProfile}>Profile</p>
                  <p onClick={handleLogout}>
                    {showLoader ? (
                      <div className='text-center'>
                        {' '}
                        <Spinner animation='border' size='sm' />
                      </div>
                    ) : (
                      'LogOut'
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <button className='login-button' onClick={handleUserLogin}>
                Login
              </button>
            )}
          </div>
          {/* {showLogInForm && !isLoggedIn && (
            <UserLoginForm
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              loggedInUserName={loggedInUserName}
              setLoggedInUserName={setLoggedInUserName}
              onSuccessLogin={() => {
                setIsLoggedIn(true);
                setShowLogInForm(false);
              }}
            />
          )} */}
        </div>
      </div>
    </Container>
  );
};

export default UserNavBar;
