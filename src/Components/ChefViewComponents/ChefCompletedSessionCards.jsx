import React, { useState, useEffect } from 'react';
import './ChefSessionCards.css';
import axios from 'axios';

const ChefCompletedSessionCards = ({ bookings }) => {
  const [sessionBookings, setSessionBookings] = useState(bookings);

  const imageFilenames = [
    'chefa.jpeg',
    'chefb.jpeg',
    'chefc.jpeg',
    'chefd.jpeg',
  ];
  const getDishesNameList = (dishDetails) => {
    return dishDetails.map((dish) => dish.name).join(',  ');
  };

  const formatDate = (startTime) => {
    const date = new Date(startTime);
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (startTime) => {
    const date = new Date(startTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours}:${
      minutes < 10 ? '0' : ''
    }${minutes} ${amOrPm}`;

    return formattedTime;
  };

  const filterPastBookings = (Bookings) => {
    Bookings.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    return Bookings;
  };

  const getChefCompletedBookings = async () => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/getcompletebookings`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cowChefToken')}`,
          },
        }
      )
      .then((response) => {
        const completedBookings = filterPastBookings(
          response.data.completedBookings
        );
        setSessionBookings(completedBookings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getChefCompletedBookings();
  }, []);

  return (
    <div className='session-cards-container'>
      {sessionBookings.map((booking, index) => (
        <div key={index} className='session-card'>
          <div className='session-user-bio-top'>
            <div className='session-user-image'>
              <img
                src={require(`../../static/chefs/${imageFilenames[1]}`)}
                className='session-user-avatar'
                alt='User Profile Picture'
              />
              <p className='booked-session-user-name'>{booking.userID.name}</p>
            </div>
          </div>
          <div className='session-card-details-container'>
            <div className='session-details'>
              <h6>{getDishesNameList(booking.dishDetails)}</h6>
              <div className='bookings-details-info'>
                <div>Guests</div>
                <div>
                  {booking.adultCount} Adults, {booking.childCount} Kids
                </div>
              </div>
              <div className='bookings-details-info'>
                <div>Date</div>
                <div>{formatDate(booking.startTime)}</div>
              </div>
              <div className='bookings-details-info'>
                <div>Time</div>
                <div>{formatTime(booking.startTime)}</div>
              </div>
              <div className='bookings-details-info'>
                <div>Fee</div>
                <div>$ {booking.totalFee}</div>
              </div>
            </div>
          </div>
          <div className='edit-booking-buttons-div'>
            {!booking.hasChefCompleted && (
              <>
                <button className='start-job-button' disabled>
                  Session missed
                </button>
              </>
            )}
            {booking.hasChefCompleted && (
              <>
                <button className='session-complete-button' disabled>
                  Session completed
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChefCompletedSessionCards;
