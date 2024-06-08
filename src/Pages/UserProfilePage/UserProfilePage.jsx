import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css';
import ProfileLeftComponent from '../../Components/BookSessionComponents/ProfileLeftComponent';
import ProfileRightComponent from '../../Components/BookSessionComponents/ProfileRightComponent';
import UserLoginForm from '../../Components/UserLoginWeb/UserLoginForm';
import axios from 'axios';
import MobileNavBar from '../../Components/Mobile_Nav/MobileNav';
// import Footer from '../../Components/Footer';
import UserNavBar from '../../Components/CommonComponents/UserNavBar';
import { Spinner } from 'react-bootstrap';

const UserProfilePage = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  const [showLogInForm, setShowLogInForm] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
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
    setShowLoader(true); // Set showLoader to true when logout starts
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
      })
      .finally(() => {
        setShowLoader(false); // Reset showLoader to false after logout completes
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      setShowLogInForm(false);
    } else {
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
      <div className='desktopviewnav'>
        <UserNavBar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInUserName={loggedInUserName}
          setLoggedInUserName={setLoggedInUserName}
        />
      </div>
      <div className='mobileviewnav'>
        <MobileNavBar text='My Profile' />
      </div>
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
              {showLoader ? (
                <div className='text-center'>
                  <Spinner animation='border' size='sm' />
                </div>
              ) : (
                'LogOut'
              )}
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
          <div className='footer_user'>{/* <Footer /> */}</div>
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

export default UserProfilePage;
