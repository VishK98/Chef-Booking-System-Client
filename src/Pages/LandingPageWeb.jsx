import React from 'react';
import Homepage from '../Components/LandingPageWeb/Homepage';
import ChefByCuisine from '../Components/LandingPageWeb/ChefByCuisine';
import ChefByDish from '../Components/LandingPageWeb/ChefByDish';
import TopRatedChefs from '../Components/LandingPageWeb/TopRatedChefs';
import './LandingPageWeb.css';

const LandingPageWeb = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  return (
    <>
      <div className='landing-page-container'>
        <Homepage />
        <ChefByDish />
        <ChefByCuisine />
        <TopRatedChefs
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInUserName={loggedInUserName}
          setLoggedInUserName={setLoggedInUserName}
        />
      </div>
    </>
  );
};

export default LandingPageWeb;
