import React from 'react';
import './ChefSessions.css';
import ChefSessionCards from './ChefSessionCards';

const ChefSessions = ({ chefBookings }) => {
  return (
    <div>
      <ChefSessionCards bookings={chefBookings} />
    </div>
  );
};

export default ChefSessions;
