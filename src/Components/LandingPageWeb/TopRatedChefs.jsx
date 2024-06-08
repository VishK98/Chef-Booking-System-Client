import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TopRatedChefs.css';
import Calender from '../../../src/static/Calender_logo.svg';
import {
  faStar,
  faChevronLeft,
  faChevronRight,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserLoginForm from '../UserLoginWeb/UserLoginForm';
import { Container } from 'react-bootstrap';

const TopRatedChefs = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [chefs, setChefs] = useState([]);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [totalSkills, setTotalSkills] = useState(3);
  const [showLogInForm, setShowLogInForm] = useState(false);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/`,
          {}
        );
        setChefs(response.data.chefs);
      } catch (error) {
        console.error('Error fetching chefs:', error);
      }
    };
    fetchChefs();
  }, []);

  const scrollLeftHandler = () => {
    if (containerRef.current) {
      const newScrollLeft = scrollLeft - containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      setScrollLeft(newScrollLeft);
    }
  };

  const bookChef = (chefId) => {
    const token = localStorage.getItem('cowToken');
    if (token) {
      sessionStorage.setItem('chefId', chefId);
      navigate('/booking');
    } else {
      setIsLoggedIn(false);
      setShowLogInForm(true);
    }
  };

  const scrollRightHandler = () => {
    if (containerRef.current) {
      const newScrollLeft = scrollLeft + containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      setScrollLeft(newScrollLeft);
    }
  };

  const toggleHiddenSkills = (index, totalSkills) => {
    const updatedChefs = [...chefs];
    updatedChefs[index].showMoreSkills = !updatedChefs[index].showMoreSkills;
    setChefs(updatedChefs);
    setTotalSkills(totalSkills);
    console.log(totalSkills);
  };

  const imageFilenames = [
    'chefa.jpeg',
    'chefb.jpeg',
    'chefc.jpeg',
    'chefd.jpeg',
  ];

  return (
    <Container>
      <div className='top-rated-chefs-row mt-4'>
        <div className='navigation-headers-top-rated'>
          <h2 className='param-headers'>Our Top Rated Chefs </h2>
          <div className='navigation-buttons-top'>
            <FontAwesomeIcon
              icon={faChevronLeft}
              style={{
                color: '#EF6820',
                backgroundColor: '#F9FAFB',
                borderRadius: '4px',
                padding: '5px',
                margin: '5px',
                width: '10px',
                height: '20px',
              }}
              size='xl'
              onClick={scrollLeftHandler}
              className='navigation-arrow'
            />
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{
                color: '#EF6820',
                backgroundColor: '#F9FAFB',
                borderRadius: '4px',
                padding: '5px',
                margin: '5px',
                width: '10px',
                height: '20px',
              }}
              size='xl'
              onClick={scrollRightHandler}
              className='navigation-arrow'
            />
          </div>
        </div>
        <div className='chefs-scroll-container' ref={containerRef}>
          {chefs.map((chef, index) => (
            <div
              className='chef-card-toprated'
              key={chef._id}
              onClick={() => bookChef(chef._id)}
            >
              <div className='chef-inner'>
                <div className='chef-image-container'>
                  <img
                    src={require(
                      `../../static/chefs/${
                        imageFilenames[index % imageFilenames.length]
                      }`
                    )}
                    alt={chef.name}
                    className='chef-img'
                  />
                </div>
                <div className='chef-details-container'>
                  <div className='chef-info'>
                    <div className='name-rating-container'>
                      <p className='chef-name-top-rated'>{chef.name}</p>
                      <span className='rating-value-top-rated'>
                        <FontAwesomeIcon
                          icon={faStar}
                          style={{
                            color: '#EF6820',
                            marginRight: '5px',
                            marginTop: '5px',
                          }}
                          size='sm'
                        />
                        {chef.rating}
                      </span>
                    </div>
                    <div className='horizontal-line'></div>
                    <div className='skills-con'>
                      <div className='skills-container'>
                        {chef.skills.slice(0, totalSkills).join(', ')}
                        {chef.skills.length > 3 && (
                          <span
                            className='more-skills'
                            onClick={() =>
                              toggleHiddenSkills(index, chef.skills.length)
                            }
                          >
                            ...{' '}
                            <a
                              onClick={() =>
                                toggleHiddenSkills(index, chef.skills.length)
                              }
                              style={{ color: 'blue' }}
                            >
                              More
                            </a>
                            {chef.showMoreSkills && (
                              <span className='hidden-skills'>
                                {chef.skills.slice(3).join(', ')}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <div className='calendar-icon-container'>
                        <img src={Calender} alt='calender' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      </div>
    </Container>
  );
};

export default TopRatedChefs;
