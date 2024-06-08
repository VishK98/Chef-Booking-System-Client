import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import './ChefProfile.css';
import ChefProfileCard from './ChefProfileCard';

const ChefProfile = ({
  isChefLoggedIn,
  chefDetails,
  setIsChefLoggedIn,
  loggedInChefName,
  setLoggedInChefName,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true); // Start the loader
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
      setLoading(false); // Stop the loader
    }
  };

  return (
    <div className='chef-account-view-mobile'>
      <ChefProfileCard chefDetails={chefDetails} />
      <button className='chef-logout-button' onClick={handleLogout}>
        {loading ? (
          <div className='text-center'>
            <Spinner animation='border' size='sm' />
          </div>
        ) : (
          'Log out'
        )}
      </button>
    </div>
  );
};

export default ChefProfile;
