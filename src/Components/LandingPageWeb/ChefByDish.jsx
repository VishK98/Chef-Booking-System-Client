import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChefByDish.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const dishImageObjectURL =
  'https://chefonwheelz.s3.ap-south-1.amazonaws.com/dishes/';

const getDishNameForURI = (dishname) => {
  return dishname.replace(/\s+/g, '+');
};

const ChefByDish = () => {
  const [dishes, setDishes] = useState([]);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const dishContainerRef = useRef(null);
  const dishContainerTwoRef = useRef(null);
  const dishContainerThreeRef = useRef(null);
  const navigate = useNavigate();
  const [filteredItems, setFilteredItems] = useState([]);

  const cardWidth = 242; // Width of each card

  const search = (e) => {
    let params = e.target.value.toLowerCase();
    let filteredDishes = dishes.filter((dish) => {
      let name = dish.name.toLowerCase();
      return name.includes(params);
    });
    setFilteredItems(params ? filteredDishes : []);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/dishes/`)
      .then((response) => {
        setDishes(response.data.dishes);
        updateTotalPages(response.data.dishes);
      })
      .catch((error) => {
        console.error('Error fetching dishes:', error);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container =
        dishContainerRef.current ||
        dishContainerTwoRef.current ||
        dishContainerThreeRef.current;
      if (container) {
        const currentPageNumber = Math.ceil(
          container.scrollLeft / container.offsetWidth
        );
        setCurrentPage(currentPageNumber);
      }
    };

    dishContainerRef.current?.addEventListener('scroll', handleScroll);
    dishContainerTwoRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      dishContainerRef.current?.removeEventListener('scroll', handleScroll);
      dishContainerTwoRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const updateTotalPages = (dishes) => {
    const container = dishContainerRef.current;
    if (container) {
      const totalWidth = container.scrollWidth;
      const viewWidth = container.clientWidth;
      const totalPages = Math.ceil(totalWidth / viewWidth);
      setTotalPages(totalPages > 0 ? totalPages : 1);
    }
  };

  const dishScrollLeftHandler = () => {
    if (dishContainerRef.current) {
      const newScrollLeft = Math.max(scrollLeft - cardWidth, 0);
      dishContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      dishContainerTwoRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      setScrollLeft(newScrollLeft);
    }
  };

  const dishScrollRightHandler = () => {
    if (dishContainerRef.current) {
      const maxScrollLeft =
        dishContainerRef.current.scrollWidth -
        dishContainerRef.current.clientWidth;
      const newScrollLeft = Math.min(scrollLeft + cardWidth, maxScrollLeft);
      dishContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      dishContainerTwoRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      setScrollLeft(newScrollLeft);
    }
  };

  const dishClickHandler = (dishName) => {
    navigate(`/chefs-by-dish/${encodeURIComponent(dishName)}`);
  };

  const handleDotClick = (index) => {
    console.log(`DOT ==> ${index}`);
    if (dishContainerRef.current) {
      const newScrollLeft = index * dishContainerRef.current.offsetWidth;
      dishContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      dishContainerTwoRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      setCurrentPage(index);
    }
  };

  return (
    <div className='container'>
      <div className='chef-by-dishes-row mt-4'>
        <div className='navigation-headers'>
          <div className='navigation-controls'>
            <h2 className='param-headers'>Chef by Dishes</h2>
            <div className='navigation-buttons'>
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
                onClick={dishScrollLeftHandler}
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
                onClick={dishScrollRightHandler}
                className='navigation-arrow'
              />
            </div>
          </div>
        </div>
        {filteredItems.length > 0 ? (
          <div className='dishes-scroll-container' ref={dishContainerThreeRef}>
            {filteredItems.map((item) => (
              <div
                className='dish-card'
                key={item.name}
                onClick={() => dishClickHandler(item.name)}
              >
                <div className='dish-inner'>
                  <img
                    src={`${dishImageObjectURL}${getDishNameForURI(item.name)}.webp`}
                    alt={item.name}
                  />
                </div>
                <p className='dish-name'>{item.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className='dishes-scroll-container' ref={dishContainerRef}>
              {dishes
                .filter((dish, i) => i % 2 === 0)
                .map((dish) => (
                  <div
                    className='dish-card'
                    key={dish.name}
                    onClick={() => dishClickHandler(dish.name)}
                  >
                    <div className='dish-inner'>
                      <img
                        src={`${dishImageObjectURL}${getDishNameForURI(dish.name)}.webp`}
                        alt={dish.name}
                      />
                    </div>
                    <p className='dish-name'>{dish.name}</p>
                  </div>
                ))}
            </div>
            <div className='dishes-scroll-container' ref={dishContainerTwoRef}>
              {dishes
                .filter((dish, i) => i % 2 !== 0)
                .map((dish) => (
                  <div
                    className='dish-card'
                    key={dish.name}
                    onClick={() => dishClickHandler(dish.name)}
                  >
                    <div className='dish-inner'>
                      <img
                        src={`${dishImageObjectURL}${getDishNameForURI(dish.name)}.webp`}
                        alt={dish.name}
                      />
                    </div>
                    <p className='dish-name'>{dish.name}</p>
                  </div>
                ))}
            </div>
          </>
        )}
        <div className='pagination-dots'>
          {[...Array(totalPages).keys()].map((idx) => (
            <span
              key={idx}
              className={currentPage === idx ? 'active-dot' : 'dot'}
              onClick={() => handleDotClick(idx)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChefByDish;
