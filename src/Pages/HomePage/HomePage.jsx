import React from 'react';
import HomePageCards from '../../Components/HomePageComponents/HomePageCards';
import UserNavBar from '../../Components/CommonComponents/UserNavBar';
import ChefByDish from '../../Components/LandingPageWeb/ChefByDish';
import ChefByCuisine from '../../Components/LandingPageWeb/ChefByCuisine';
import TopRatedChefs from '../../Components/LandingPageWeb/TopRatedChefs';
// import Footer from '../../Components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  return (
    <>
      <div>
        <UserNavBar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInUserName={loggedInUserName}
          setLoggedInUserName={setLoggedInUserName}
        />
        <HomePageCards />
        <ChefByDish />
        <ChefByCuisine />
        <TopRatedChefs
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInUserName={loggedInUserName}
          setLoggedInUserName={setLoggedInUserName}
        />
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default HomePage;
