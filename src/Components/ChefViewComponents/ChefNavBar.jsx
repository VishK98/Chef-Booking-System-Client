import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import AddressAutosuggest from '../AddressAutoSuggest';
import { Spinner } from 'react-bootstrap';
import logo from '../../static/logo_no_background.svg';
import './ChefNavBar.css';

const ChefNavBar = ({ chefName, setIsChefLoggedIn }) => {
  const [currentLocation, setCurrentLocation] = useState('Detect my location');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    getLocationFromIp();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log('Clicked outside, closing dropdown');
        setDropdownOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/chef/profile');
  };

  const visitProfile = () => {
    navigate('/chef/profile');
    setDropdownOpen(false); // Close dropdown after navigating to profile
  };

  const handleLogout = async () => {
    setLoading(true); // Start loading
    try {
      // Simulate a delay to show the loader
      await new Promise((resolve) => setTimeout(resolve, 2000));
      localStorage.removeItem('cowChefName');
      localStorage.removeItem('cowChefToken');
      localStorage.removeItem('cowChefTokenExpiration');
      navigate('/chef');
      setIsChefLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className='header'>
      <div className='left'>
        <img src={logo} alt='Logo' className='logo' onClick={handleLogoClick} />
        <h3 className='App-name' onClick={handleLogoClick}>
          Chef on Wheelz
        </h3>
      </div>
      <div className='AddressAutosuggestChefNav'>
        <AddressAutosuggest />
      </div>
      <div className='right'>
        <div className='user-info dropdown' ref={dropdownRef}>
          <p className='navbar-user-name'>{chefName}</p>
          &nbsp; &nbsp;
          <FontAwesomeIcon
            icon={faCaretDown}
            className='dropdown-icon dropbtn'
            onClick={() => {
              console.log('Dropdown icon clicked');
              setDropdownOpen(!dropdownOpen);
            }}
            style={{
              color: '#107569',
              borderRadius: '4px',
              padding: '5px',
              margin: '5px',
              width: '25px',
              height: '25px',
            }}
            size='xl'
          />
          {dropdownOpen && (
            <div className='dropdown-content_chef'>
              <p onClick={visitProfile}>Profile</p>
              <p onClick={handleLogout}>
                {loading ? (
                  <div className='text-center'>
                    <Spinner animation='border' size='sm' />
                  </div>
                ) : (
                  'Log Out'
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefNavBar;
