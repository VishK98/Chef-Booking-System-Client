import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUtensils, faClock } from '@fortawesome/free-solid-svg-icons';
import { ChefContext } from '../../App';
import Footer from '../../Components/Footer';
import axios from 'axios';
import filterLines from '../../static/svgs/filter-lines.svg';
import UserLoginForm from '../../Components/UserLoginWeb/UserLoginForm';
import UserNavBar from '../../Components/CommonComponents/UserNavBar';
import './ChefsByDish.css';

const ChefsByDish = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  const [chefs, setChefs] = useState([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [allDishes, setAllDishes] = useState([]);
  const { dishName } = useParams();
  const navigate = useNavigate();

  const { setChefId } = useContext(ChefContext);

  const [showLogInForm, setShowLogInForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/bydish`,
          {
            params: { dishName },
          }
        );
        setChefs(response.data.chefs);
      } catch (error) {
        console.error('Error fetching chefs:', error);
      }
    };

    fetchData();
  }, [dishName]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/dishes/`)
      .then((response) => {
        setAllDishes(response.data.dishes);
      })
      .catch((error) => {
        console.error('Error fetching cuisines:', error);
      });
  }, []);

  const toggleShowAllSkills = () => {
    setShowAllSkills(!showAllSkills);
  };

  // const bookingClickhandler = (chefId) => {
  //   const token = localStorage.getItem('cowToken');
  //   if (token) {
  //     setChefId(chefId);
  //     sessionStorage.setItem('chefId', chefId);
  //     navigate('/booking');
  //   } else {
  //     console.log(`I am here ${dishName}`);
  //     setIsLoggedIn(false);
  //     setShowLogInForm(true);
  //   }
  // };
  const bookingClickhandler = (chefId, selectedDishName) => {
    const token = localStorage.getItem('cowToken');
    if (token) {
      setChefId(chefId);
      sessionStorage.setItem('chefId', chefId);
      console.log(`I am here ${selectedDishName}`);
      navigate('/booking');
    } else {
      console.log(`I Yup==>${selectedDishName}`);
      sessionStorage.setItem('selectedDishName', selectedDishName);
      setIsLoggedIn(false);
      setShowLogInForm(true);
    }
  };

  const imageFilenames = [
    'chefa.jpeg',
    'chefb.jpeg',
    'chefc.jpeg',
    'chefd.jpeg',
  ];

  return (
    <>
      <UserNavBar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        loggedInUserName={loggedInUserName}
        setLoggedInUserName={setLoggedInUserName}
      />
      {!showLogInForm && (
        <div className='listed-chefs'>
          <div className='cuisine-fix-header'>
            <div className='cuisine-name-icon-header'>
              <FontAwesomeIcon
                icon={faUtensils}
                style={{
                  color: '#EF6820',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '4px',
                  padding: '5px',
                  margin: '5px',
                }}
                size='lg'
                className='navigation-arrow'
              />
              <h1 className='cuisine-name-header'>{dishName}</h1>
            </div>
            <p className='cuisine-name-text'>
              Craving for {dishName}, We will cook what ever is on your mind
            </p>
            <div className='header-controls'>
              <div className='chef-listing-page-buttons'>
                <button className='sort-by-button'>Sort By</button>
                <button className='filter-button'>
                  <img src={filterLines} alt='filter' />
                  Filters
                </button>
              </div>
              <div className='cuisine-pills'>
                {allDishes.map((dish) => (
                  <Link
                    to={`/chefs-by-dish/${encodeURIComponent(dish.name)}`}
                    key={dish.name}
                    className={dishName === dish.name ? 'active' : ''}
                  >
                    {dish.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className='chefs-list-container'>
              {chefs.map((chef, index) => (
                <div key={chef._id} className='chef-card'>
                  <div className='chef-bio-top'>
                    <div className='chef-image'>
                      <img
                        src={require(
                          `../../static/chefs/${
                            imageFilenames[index % imageFilenames.length]
                          }`
                        )}
                        alt={chef.name}
                        className='chef-avatar'
                      />
                      <span className='space-between'></span>
                      {`$${chef.pricePerHour}/hour`}
                      <p className='yoe-text'>Exp. 8 years</p>
                      <p className='rating-text-chefbycuisine'>
                        Ratings
                        <span className='skill-pill rating-value'>
                          <FontAwesomeIcon
                            icon={faStar}
                            style={{
                              color: '#EF6820',
                            }}
                            size='sm'
                          />
                          {` ${chef.rating}`}
                        </span>
                      </p>
                    </div>
                    <div className='chef-details'>
                      <p className='chef-name'>{chef.name}</p>
                      <p className='cuisines-and-dishes'>Cuisine and Dishes</p>
                      <div className='chef-skills'>
                        {chef.skills
                          .concat(chef.dishes)
                          .slice(0, 5)
                          .map((item, index) => (
                            <span
                              className='skill-pill-chefbycuisine'
                              key={index}
                            >
                              {item}
                            </span>
                          ))}
                        {chef.skills.length + chef.dishes.length > 5 && (
                          <span
                            className='skill-pill show-more'
                            onClick={toggleShowAllSkills}
                          >
                            <u>View All</u>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='booking-section'>
                    <div className='booking-section-left-side'>
                      <p className='available-from'>Available from</p>
                      <div className='booking-section-bottom'>
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{
                            borderRadius: '4px',
                            padding: '5px',
                            margin: '5px',
                          }}
                          size='lg'
                          className='fa-icon'
                        />
                        <p className='slot-time'>
                          {new Date(chef.serviceStartTime).toLocaleTimeString(
                            [],
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}{' '}
                          -{' '}
                          {new Date(chef.serviceEndTime).toLocaleTimeString(
                            [],
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div
                      className='book-chef-session-button'
                      onClick={() => bookingClickhandler(chef._id, dishName)}
                    >
                      Book a Session
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <Footer /> */}
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
        />
      )}
    </>
  );
};

export default ChefsByDish;
