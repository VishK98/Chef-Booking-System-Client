import React, { useState, useEffect } from 'react';
import './BookedSessionCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const BookedSessionCards = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
  bookings,
}) => {
  const [sessionBookings, setSessionBookings] = useState(bookings);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [canceledBookings, setCanceledBookings] = useState([]);

  const filterFutureBookings = (Bookings) => {
    const currentTime = new Date();
    const futureBookings = Bookings.filter(
      (booking) => new Date(booking.endTime) > currentTime
    );
    futureBookings.sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );
    return futureBookings;
  };

  const imageFilenames = [
    'chefa.jpeg',
    'chefb.jpeg',
    'chefc.jpeg',
    'chefd.jpeg',
  ];

  const otp_booking = ['1234'];
  const service_ends_otp = ['5678'];

  const getDishesNameList = (dishDetails) => {
    return dishDetails.map((dish) => dish.name).join(',  ');
  };
  const getDishImageUrl = (dishName) => {
    if (dishName && dishName.length > 0) {
      const formattedDishName = dishName.replace(/ /g, '+');
      const imageUrl = `https://chefonwheelz.s3.ap-south-1.amazonaws.com/dishes/${formattedDishName}.webp`;
      console.log('Image URL:', imageUrl); // Log the URL to check it
      return imageUrl;
    }
    return '';
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
    const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${amOrPm}`;

    return formattedTime;
  };

  const getUserBookings = async () => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/getbooking`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cowToken')}`,
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

  useEffect(() => {
    if (isLoggedIn) getUserBookings();
  }, [isLoggedIn]);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedBooking(null);
  };

  const handleConfirmCancel = () => {
    if (selectedBooking) {
      setCanceledBookings([...canceledBookings, selectedBooking._id]);
    }
    handleClosePopup();
  };

  return (
    <>
      <div className='session-cards-container'>
        {sessionBookings.map((booking, index) => (
          <div
            key={index}
            className='session-card'
            style={{
              backgroundColor: canceledBookings.includes(booking._id)
                ? '#FEF3F2'
                : '',
            }}
          >
            <div>
              {canceledBookings.includes(booking._id) && (
                <div className='cancelem'>
                  <p className='canceled-message'>Your booking is canceled</p>
                </div>
              )}
              <div className='session-chef-bio-top'>
                <div className='session-chef-image'>
                  <img
                    src={require(`../../static/chefs/${imageFilenames[2]}`)}
                    className='session-chef-avatar'
                    alt='Chef'
                  />
                  <p className='booked-session-chef-name'>
                    {booking.chefID.name}
                  </p>
                </div>
                <div className='session-rating-text'>
                  <span className='session-rating-value'>
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: '#EF6820' }}
                      size='sm'
                    />
                    {booking.chefID.rating}
                  </span>
                  <span className='session-rating-text'>(80 Reviews)</span>
                </div>
              </div>
              <div className='session-card-details-container'>
                <div className='bookedimg'>
                  <img
                    src={getDishImageUrl(
                      getDishesNameList(booking.dishDetails)
                    )}
                    alt={getDishesNameList(booking.dishDetails)}
                    className='booked-session-dish-image'
                  />
                </div>
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
              {!canceledBookings.includes(booking._id) && (
                <div className='edit-booking-buttons-div'>
                  {!booking.hasChefStarted && !booking.hasChefCompleted && (
                    <>
                      <button className='reschedule-booking-button'>
                        Reschedule
                      </button>
                      <button
                        className='cancel-booking-button'
                        onClick={() => handleCancelClick(booking)}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {booking.hasChefCompleted && (
                    <>
                      <button className='session-complete-button' disabled>
                        Session Ended
                      </button>
                    </>
                  )}
                  {!booking.hasChefCompleted && booking.hasChefStarted && (
                    <>
                      <button className='session-in-progress-button' disabled>
                        Session in Progress
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {!canceledBookings.includes(booking._id) && (
              <div className='otp_booking_and_end'>
                <div className='otp-booking'>
                  <p>Share this OTP with the chef:</p>
                  <p id='otp-booking'>{otp_booking}</p>
                </div>
                <div className='service_ends_otp'>
                  <p>Share this OTP with the chef once the service ends:</p>
                  <p id='service_ends_otp'>{service_ends_otp}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showPopup && (
        <div className='popup_canile'>
          <div className='popup-inner'>
            <p>Are you sure you want to cancel this booking?</p>
            <div className='popup-buttons'>
              <button id='popup_cancile' onClick={handleConfirmCancel}>
                Cancel
              </button>
              <button id='popup_no' onClick={handleClosePopup}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookedSessionCards;
