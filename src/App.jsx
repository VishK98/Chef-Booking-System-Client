import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HomePage from './Pages/HomePage/HomePage';
import BookingPage from './Pages/BookingPage/BookingPage';
import UserProfilePage from './Pages/UserProfilePage/UserProfilePage';
import SessionsMobileView from './Pages/SessionsMobileView';
import BottomNavbar from './Components/BottomNavBar';
import ChefByDish from './Pages/ChefsByDish/ChefsByDish';
import ChefNavbar from './Components/ChefNavbar';
import Chef from './Pages/Chef';
import ChefSession from './Components/ChefViewComponents/ChefSessions';
import ChefCompletedSessions from './Components/ChefViewComponents/ChefCompletedSessions';
import ChefProfile from './Components/ChefViewComponents/ChefProfile';
import ChefsByCuisine from './Pages/ChefsByCuisine/ChefsByCuisine';
import ChefLoginForm from './Components/ChefLogin/ChefLoginForm';
import UserLoginForm from './Components/UserLoginWeb/UserLoginForm';
import UserSignUpWeb from './Components/UserSignUpWeb/UserSignUpWeb';
import MobileNav from './Components/Mobile_Nav/MobileNav';
import Footer from './Components/Footer';

export const ChefContext = React.createContext();

const App = () => {
  const [chefId, setChefId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState('');
  const [isChefLoggedIn, setIsChefLoggedIn] = useState(false);
  const [loggedInChefName, setLoggedInChefName] = useState('');
  const [showBottomNavbarUser, setShowBottomNavbarUser] = useState(true);
  const [showLogInForm, setShowLogInForm] = useState(false);
  const urlLocation = useLocation();

  useEffect(() => {
    setShowBottomNavbarUser(!urlLocation.pathname.includes('/chef/'));
  }, [urlLocation.pathname]);

  return (
    <div className='App'>
      <link
        href='https://fonts.googleapis.com/css2?family=Sora:wght@600&display=swap'
        rel='stylesheet'
      ></link>
      <link
        href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap'
        rel='stylesheet'
      ></link>
      <div className='homepage-body-div'>
        <ChefContext.Provider value={{ chefId, setChefId }}>
          <Routes>
            <Route path='/mobilenav' Component={MobileNav} />
            <Route
              path='/'
              element={
                <HomePage
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loggedInUserName={loggedInUserName}
                  setLoggedInUserName={setLoggedInUserName}
                />
              }
            />
            <Route
              path='/booking'
              element={
                <BookingPage
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loggedInUserName={loggedInUserName}
                  setLoggedInUserName={setLoggedInUserName}
                />
              }
            />
            <Route
              path='/chefs-by-cuisine/:cuisineName'
              element={
                <ChefsByCuisine
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loggedInUserName={loggedInUserName}
                  setLoggedInUserName={setLoggedInUserName}
                />
              }
            />
            <Route
              path='/chefs-by-dish/:dishName'
              element={
                <ChefByDish
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loggedInUserName={loggedInUserName}
                  setLoggedInUserName={setLoggedInUserName}
                />
              }
            />
            <Route
              path='/profile'
              element={
                <UserProfilePage
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loggedInUserName={loggedInUserName}
                  setLoggedInUserName={setLoggedInUserName}
                />
              }
            />
            <Route
              path='/usersessions'
              element={
                <SessionsMobileView
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loggedInUserName={loggedInUserName}
                  setLoggedInUserName={setLoggedInUserName}
                />
              }
            />
            <Route
              path='login'
              element={
                <UserLoginForm
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loggedInUserName={loggedInUserName}
                  setLoggedInUserName={setLoggedInUserName}
                  onSuccessLogin={() => {
                    setIsLoggedIn(true);
                    setShowLogInForm(false);
                  }}
                />
              }
            />
            <Route path='signup' element={<UserSignUpWeb />} />

            <Route
              path='/chef/*'
              element={
                <Chef
                  isChefLoggedIn={isChefLoggedIn}
                  setIsChefLoggedIn={setIsChefLoggedIn}
                  loggedInChefName={loggedInChefName}
                  setLoggedInChefName={setLoggedInChefName}
                />
              }
            >
              <Route path='sessions' element={<ChefSession />} />
              <Route path='profile' element={<ChefProfile />} />
              <Route path='completed' element={<ChefCompletedSessions />} />
              <Route path='login' element={<ChefLoginForm />} />
            </Route>
          </Routes>
        </ChefContext.Provider>
      </div>
      <Footer /> {/* Adding Footer here */}
      {showBottomNavbarUser && (
        <BottomNavbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInUserName={loggedInUserName}
          setLoggedInUserName={setLoggedInUserName}
        />
      )}
      {!showBottomNavbarUser && (
        <ChefNavbar
          isChefLoggedIn={isChefLoggedIn}
          setIsChefLoggedIn={setIsChefLoggedIn}
          loggedInChefName={loggedInChefName}
          setLoggedInChefName={setLoggedInChefName}
        />
      )}
    </div>
  );
};

export default App;
