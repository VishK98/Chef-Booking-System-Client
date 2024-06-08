import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import ChefSessions from '../Components/ChefViewComponents/ChefSessions';
import ChefCompletedSessions from '../Components/ChefViewComponents/ChefCompletedSessions';
import ChefProfile from '../Components/ChefViewComponents/ChefProfile';
import ChefLoginForm from '../Components/ChefLogin/ChefLoginForm';
import ChefNavBar from '../Components/ChefViewComponents/ChefNavBar';
import OnboardChefForm from '../Components/ChefViewComponents/OnboardChefForm';

const Chef = ({
  isChefLoggedIn,
  setIsChefLoggedIn,
  loggedInChefName,
  setLoggedInChefName,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [chefDetails, setChefDetails] = useState({});
  const [chefBookings, setChefBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  //check if chef is logged in
  useEffect(() => {
    const token = localStorage.getItem('cowChefToken');
    const expirationTime = localStorage.getItem('cowChefTokenExpiration');

    if (token && expirationTime) {
      const currentTime = new Date();
      if (currentTime < new Date(expirationTime)) {
        setIsChefLoggedIn(true);
        setLoggedInChefName(localStorage.getItem('cowChefName'));
      } else {
        localStorage.removeItem('cowChefToken');
        localStorage.removeItem('cowChefTokenExpiration');
        setIsChefLoggedIn(false);
      }
    }
  }, []);

  //get chef details for profile
  useEffect(() => {
    const getChefBookings = async () => {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/getprofile`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('cowChefToken')}`,
            },
          }
        )
        .then((response) => {
          setChefDetails(response.data.chefDetails);

          const email = response.data.chefDetails.email;
          if (
            email === 'maniyasagar26@gmail.com' ||
            email === 'kuldeepsinghrautela@outlook.com' ||
            email === 'chefonwheelz@outlook.com' ||
            email === 'sandyverm1@gmail.com'
          ) {
            setIsAdminLoggedIn(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
          const completedPastBookings = filterPastBookings(
            response.data.completedBookings
          );
          setCompletedBookings(completedPastBookings);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (isChefLoggedIn) {
      getChefBookings();
      getChefCompletedBookings();
    }
  }, [isChefLoggedIn]);

  //filter future bookings
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

  // filter completed bookings
  const filterPastBookings = (Bookings) => {
    Bookings.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    return Bookings;
  };

  //get chef bookings
  useEffect(() => {
    //if url is chef then it should be changed to chef/profile
    if (location.pathname === '/chef') {
      navigate('/chef/profile');
    }
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
          setChefBookings(futureBookings);
        })
        .catch((err) => {
          console.log(err);
        });
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
          const completedPastBookings = filterPastBookings(
            response.data.completedBookings
          );
          setCompletedBookings(completedPastBookings);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (isChefLoggedIn) {
      getChefBookings();
      getChefCompletedBookings();
    }
  }, [isChefLoggedIn]);

  return (
    <div>
      {isChefLoggedIn ? (
        <div>
          <ChefNavBar
            isLoggedIn={isChefLoggedIn}
            chefName={loggedInChefName}
            setIsChefLoggedIn={setIsChefLoggedIn}
          ></ChefNavBar>
          <div className='chef-session-pills'>
            <p
              className={
                location.pathname === '/chef/sessions'
                  ? 'chef-view-active'
                  : 'link-disabled'
              }
              onClick={() => navigate('/chef/sessions')}
            >
              Upcoming Sessions
            </p>
            <p
              className={
                location.pathname === '/chef/completed'
                  ? 'chef-view-active'
                  : 'link-disabled'
              }
              onClick={() => navigate('/chef/completed')}
            >
              Completed Sessions
            </p>
            <p
              className={
                location.pathname === '/chef/profile'
                  ? 'chef-view-active'
                  : 'link-disable'
              }
              onClick={() => navigate('/chef/profile')}
            >
              Account
            </p>
            {isAdminLoggedIn && (
              <p
                className={
                  location.pathname === '/chef/on-boarding'
                    ? 'chef-view-active'
                    : 'link-disable'
                }
                onClick={() => navigate('/chef/on-boarding')}
              >
                On Boarding Chef
              </p>
            )}
          </div>
          <Routes>
            <Route
              path='sessions'
              element={<ChefSessions chefBookings={chefBookings} />}
            />
            <Route
              path='completed'
              element={<ChefCompletedSessions bookings={completedBookings} />}
            />
            {isAdminLoggedIn && (
              <Route path='on-boarding' element={<OnboardChefForm />} />
            )}
            <Route
              path='profile'
              element={
                <ChefProfile
                  isChefLoggedIn={isChefLoggedIn}
                  setIsChefLoggedIn={setIsChefLoggedIn}
                  loggedInChefName={loggedInChefName}
                  setLoggedInChefName={setLoggedInChefName}
                  chefDetails={chefDetails}
                />
              }
            />
          </Routes>
        </div>
      ) : (
        <ChefLoginForm
          isChefLoggedIn={isChefLoggedIn}
          setIsChefLoggedIn={setIsChefLoggedIn}
          loggedInChefName={loggedInChefName}
          setLoggedInChefName={setLoggedInChefName}
        />
      )}
    </div>
  );
};

export default Chef;
