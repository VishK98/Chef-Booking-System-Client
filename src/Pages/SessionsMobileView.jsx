import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLoginForm from '../Components/UserLoginWeb/UserLoginForm';
import BookedSessionCards from '../Components/BookSessionComponents/BookedSessionCards';
import './SessionsMobileView.css';
import MobileNavBar from '../Components/Mobile_Nav/MobileNav';
import axios from 'axios';

const SessionsMobileView = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  const [showLogInForm, setShowLogInForm] = useState(false);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const filterFutureBookings = (bookings) => {
    const currentTime = new Date();
    const futureBookings = bookings.filter(
      (booking) => new Date(booking.endTime) > currentTime
    );
    futureBookings.sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );
    return futureBookings;
  };

  useEffect(() => {
    if (isLoggedIn) {
      setShowLogInForm(false);
    } else {
      // navigate("/");
      setShowLogInForm(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchUserAndBookingInfos = async () => {
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
          setBookings(futureBookings);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (isLoggedIn) fetchUserAndBookingInfos();
  }, [isLoggedIn]);

  return (
    <>
      <MobileNavBar text='Upcoming Sessions' />
      {/* <UserNavBar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        loggedInUserName={loggedInUserName}
        setLoggedInUserName={setLoggedInUserName}
      /> */}
      {!showLogInForm && (
        <BookedSessionCards
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInUserName={loggedInUserName}
          setLoggedInUserName={setLoggedInUserName}
          bookings={bookings}
        />
      )}
      {showLogInForm && !isLoggedIn && (
        <UserLoginForm
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInUserName={loggedInUserName}
          setLoggedInUserName={setLoggedInUserName}
          onSuccessLogin={() => {
            setIsLoggedIn(true);
            setShowLogInForm(false);
          }}
          onSuccessLogout={() => {
            setIsLoggedIn(false);
            setShowLogInForm(true);
          }}
        />
      )}
    </>
  );
};

export default SessionsMobileView;
