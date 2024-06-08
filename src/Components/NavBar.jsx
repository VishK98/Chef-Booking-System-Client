import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import logo from '../static/logo_no_background.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import UserLoginForm from './UserLoginWeb/UserLoginForm';
import AddressAutosuggest from './AddressAutoSuggest';
import SearchBar from './SearchBar';
import BecomeAchef from './BecomeAchef';

const NavBar = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  const [currentLocation, setCurrentLocation] = useState('Detect my location');
  const [showLogInForm, setShowLogInForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const handleUserLogin = () => {
    // if (!isLoggedIn) {
    //   setShowLogInForm(!showLogInForm);
    // }
    navigate('/login' , {state : {path : window.location.pathname}})
  };

  const handleLogout = async () => {
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
        navigate('/');
      })
      .catch((err) => {
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

  const handleLogoClick = () => {
    navigate('/');
  };

  const visitProfile = () => {
    navigate('/profile');
    document.getElementById('myDropdown').classList.toggle('show');
  };

  return (
    <div className='header'>
      <div className='left'>
        <img src={logo} alt='Logo' className='logo' onClick={handleLogoClick} />
        <h3 className='App-name' onClick={handleLogoClick}>
          Chef on Wheelz
        </h3>
        {/* <div className='autoandsearch'>
          <AddressAutosuggest />
          <p className='vl'></p>
          <SearchBar />
        </div> */}
      </div>
      <div className='right'>
        <BecomeAchef />
        {isLoggedIn ? (
          <div className='user-info dropdown'>
            <p className='navbar-user-name'>{loggedInUserName}</p>
            &nbsp; &nbsp;
            <FontAwesomeIcon
              icon={faCaretDown}
              className='dropdown-icon dropbtn'
              onClick={() => {
                setShowDropdown(true);
                document.getElementById('myDropdown').classList.toggle('show');
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
            <div id='myDropdown' className='dropdown-content'>
              <p onClick={visitProfile}>Profile</p>
              <p onClick={handleLogout}>Log Out</p>
            </div>
          </div>
        ) : (
          <button className='login-button' onClick={handleUserLogin}>
            Login
          </button>
        )}
        {/* */}
      </div>
    </div>
  );
};

export default NavBar;
