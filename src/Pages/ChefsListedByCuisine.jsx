import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChefsListedByCuisine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUtensils, faClock } from '@fortawesome/free-solid-svg-icons';
// import { faClock } from "@fortawesome/pro-light-svg-icons";
import filterLines from '../static/svgs/filter-lines.svg';
import UserLoginForm from '../Components/UserLoginWeb/UserLoginForm';

import { ChefContext } from '../App';

const ChefsListedByCuisine = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  const [chefs, setChefs] = useState([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [allCuisines, setAllCuisines] = useState([]);
  const { cuisineName } = useParams();
  const navigate = useNavigate();

  const { setChefId } = useContext(ChefContext);

  const [showLogInForm, setShowLogInForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/bycuisine`,
          {
            params: { cuisineName },
          }
        );
        setChefs(response.data.chefs);
      } catch (error) {
        console.error('Error fetching chefs:', error);
      }
    };
    fetchData();
  }, [cuisineName]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/cuisines/`)
      .then((response) => {
        setAllCuisines(response.data.cuisines);
      })
      .catch((error) => {
        console.error('Error fetching cuisines:', error);
      });
  }, []);

  const toggleShowAllSkills = () => {
    setShowAllSkills(!showAllSkills);
  };

  const bookingClickhandler = (chefId) => {
    const token = localStorage.getItem('cowToken');
    if (token) {
      setChefId(chefId);
      sessionStorage.setItem('chefId', chefId);
      navigate('/booking');
    } else {
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
      {!showLogInForm && (
        <div className='listed-chefs'>
          <div className='cuisine-fix-header'>
            <div className='cuisine-name-icon-header'>
              <FontAwesomeIcon
                icon={faUtensils}
                size='lg'
                className='navigation-arrow navigation-arrow-style'
              />
              <h1 className='cuisine-name-header'>{cuisineName}</h1>
            </div>
            <p className='cuisine-name-text'>
              Craving for {cuisineName}, We will cook whatever is on your mind
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
                {allCuisines.map((cuisine) => (
                  <Link
                    to={`/chefs-by-cuisine/${encodeURIComponent(cuisine.name)}`}
                    key={cuisine.name}
                    className={cuisineName === cuisine.name ? 'active' : ''}
                  >
                    {cuisine.name}
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
                          `../static/chefs/${
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
                        <span className='skill-pill-chefbycuisine rating-value-chefbycuisine rating-pill'>
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
                        {chef.skills.length + chef.dishes.length > 7 && (
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
                      onClick={() => bookingClickhandler(chef._id)}
                    >
                      Book a Session
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
        />
      )}
    </>
  );
};

export default ChefsListedByCuisine;
