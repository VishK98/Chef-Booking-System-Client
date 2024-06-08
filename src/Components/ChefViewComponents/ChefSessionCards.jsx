import React, { useState, useEffect } from 'react';
import './ChefSessionCards.css';
import axios from 'axios';

const ChefSessionCards = ({ bookings }) => {
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

  const isSessionReadyToStart = (startTime) => {
    const currentTime = new Date();
    const fifteenMinutesBeforeBooking = new Date(startTime);
    fifteenMinutesBeforeBooking.setMinutes(
      fifteenMinutesBeforeBooking.getMinutes() - 15
    );
    const fifteenMinutesAfterBooking = new Date(startTime);
    fifteenMinutesAfterBooking.setMinutes(
      fifteenMinutesAfterBooking.getMinutes() + 15
    );
    const isWithin15Minutes =
      currentTime > fifteenMinutesBeforeBooking &&
      currentTime < fifteenMinutesAfterBooking;
    // manual check
    // const bookingStartTime = new Date(startTime);
    // const april5StartTime = new Date("2024-04-05T10:00:00");
    // const isApril5StartTime =bookingStartTime.getTime() === april5StartTime.getTime();

    return isWithin15Minutes;
  };

  const isSessionMissed = (startTime) => {
    const currentTime = new Date();
    const fifteenMinutesAfterBooking = new Date(startTime);
    fifteenMinutesAfterBooking.setMinutes(
      fifteenMinutesAfterBooking.getMinutes() + 15
    );
    return currentTime > fifteenMinutesAfterBooking;
  };

  const isSessionReadyToEnd = (endTime) => {
    const currentTime = new Date();
    const fifteenMinutesBeforeBooking = new Date(endTime);
    fifteenMinutesBeforeBooking.setMinutes(
      fifteenMinutesBeforeBooking.getMinutes() - 15
    );
    const fifteenMinutesAfterBooking = new Date(endTime);
    fifteenMinutesAfterBooking.setMinutes(
      fifteenMinutesAfterBooking.getMinutes() + 15
    );
    const isWithin15Minutes =
      currentTime > fifteenMinutesBeforeBooking &&
      currentTime < fifteenMinutesAfterBooking;
    // manual check
    // const bookingEndTime = new Date(endTime);
    // const april5StartTime = new Date("2024-04-05T12:00:00");
    // const isApril5StartTime =bookingEndTime.getTime() === april5StartTime.getTime();

    return isWithin15Minutes;
  };

  const filterFutureBookings = (bookings) => {
    const currentTime = new Date();
    const fifteenMinutesBefore = new Date(currentTime.getTime() - 15 * 60000);
    const futureBookings = bookings.filter((booking) => {
      const endTime = new Date(booking.endTime);
      return endTime > fifteenMinutesBefore;
    });
    futureBookings.sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );
    return futureBookings;
  };

  const getChefBookings = async () => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/getbookings`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cowChefToken')}`,
          },
        }
      )
      .then((response) => {
        const futureBookings = filterFutureBookings(response.data.bookings);
        setSessionBookings(futureBookings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const startSession = async (booking) => {
    const bookingID = booking._id;
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/startsession`,
        { bookingID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cowChefToken')}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        getChefBookings();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const endSession = async (booking) => {
    const bookingID = booking._id;
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/endsession`,
        { bookingID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cowChefToken')}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        getChefBookings();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getChefBookings();
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
            {!booking.hasChefStarted && (
              <>
                <button
                  className='start-job-button'
                  disabled={!isSessionReadyToStart(booking.startTime)}
                  onClick={() => startSession(booking)}
                >
                  {isSessionMissed(booking.startTime)
                    ? 'Session Missed'
                    : 'Start Session'}
                </button>
              </>
            )}
            {booking.hasChefStarted && !booking.hasChefCompleted && (
              <>
                <button
                  className='session-in-progress-button-chef'
                  disabled={
                    !booking.hasChefStarted ||
                    !isSessionReadyToEnd(booking.endTime)
                  }
                  onClick={() => endSession(booking)}
                >
                  End session
                </button>
              </>
            )}
            {booking.hasChefCompleted && (
              <>
                <button className='session-complete-button' disabled>
                  Session ended
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChefSessionCards;
