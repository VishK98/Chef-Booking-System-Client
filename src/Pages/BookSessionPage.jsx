import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookSessionPage.css';
import ProfileLeftComponent from '../Components/BookSessionComponents/ProfileLeftComponent';
import ProfileRightComponent from '../Components/BookSessionComponents/ProfileRightComponent';
import UserLoginForm from '../Components/UserLoginWeb/UserLoginForm';
import axios from 'axios';

const BookSessionPage = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  const [showLogInForm, setShowLogInForm] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
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
        setShowLogInForm(false);
        setIsLoggedIn(false);
        setLoggedInUserName('');
      })
      .catch((err) => {
        console.log(err);
      });
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
          setUserInfo({
            ...userInfo,
            name: response.data.name,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            address: response.data.address,
          });
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
      {!showLogInForm && (
        <div className='booking-session-page-main'>
          <div className='booking-session-page-left'>
            <ProfileLeftComponent
              name={userInfo.name}
              email={userInfo.email}
              phoneNumber={userInfo.phoneNumber}
              address={userInfo.address}
            />
            <button
              className='log-out-button-account-page'
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
          <div className='booking-session-page-right'>
            <ProfileRightComponent
              bookings={bookings}
              name={userInfo.name}
              address={userInfo.address}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              loggedInUserName={loggedInUserName}
              setLoggedInUserName={setLoggedInUserName}
            />
          </div>
        </div>
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

export default BookSessionPage;
