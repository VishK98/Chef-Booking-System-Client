import React from 'react';
import './ChefCompletedSessions.css';
import ChefCompletedSessionCards from './ChefCompletedSessionCards';

const ChefCompletedSessions = ({ bookings }) => {
  return (
    <div>
      <ChefCompletedSessionCards bookings={bookings} />
    </div>
  );
};

export default ChefCompletedSessions;
