import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './DishesForBookingPage.css';

const dishImageObjectURL =
  'https://chefonwheelz.s3.ap-south-1.amazonaws.com/dishes/';

const getDishNameForURI = (dishname) => {
  return dishname.replace(/\s+/g, '+');
};

const maxDishLimit = 2;

const DishesForBookingPage = ({ chefId, onSelectDishes }) => {
  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dishContainerRef = useRef(null);
  const dishContainerTwoRef = useRef(null);
  const [filteredItems, setFilteredItems] = useState([]);

  const search = (e) => {
    let params = e.target.value.toLowerCase();
    let filteredDishes = dishes.filter((dish) =>
      dish.toLowerCase().includes(params)
    );
    setFilteredItems(filteredDishes);
  };

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/alldishes`,
          { params: { chefId } }
        );
        setDishes(response.data.dishes);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchDishes();
  }, [chefId]);

  const dishScrollLeftHandler = () => {
    if (dishContainerRef.current) {
      const newScrollLeft = scrollLeft - dishContainerRef.current.offsetWidth;
      dishContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      setScrollLeft(newScrollLeft);
    }
  };

  const dishScrollRightHandler = () => {
    if (dishContainerRef.current) {
      const newScrollLeft = scrollLeft + dishContainerRef.current.offsetWidth;
      dishContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      setScrollLeft(newScrollLeft);
    }
  };

  const dishClickHandler = (dishName) => {
    console.log(dishName);
  };

  const addDishToBill = (dishName) => {
    if (
      !selectedDishes.includes(dishName) &&
      selectedDishes.length < maxDishLimit
    ) {
      setSelectedDishes([...selectedDishes, dishName]);
      onSelectDishes([...selectedDishes, dishName]);
    }
  };

  const removeDishFromBooking = (dishName) => {
    const updatedDishes = selectedDishes.filter((dish) => dish !== dishName);
    setSelectedDishes(updatedDishes);
    onSelectDishes(updatedDishes);
  };

  const handleButtonClass = (dishName) => {
    if (selectedDishes.includes(dishName)) {
      return 'dish-remove-button';
    } else if (selectedDishes.length >= maxDishLimit) {
      return 'dish-add-disabled-button';
    } else {
      return 'dish-add-button';
    }
  };

  const handleButtonClick = (dishName) => {
    if (selectedDishes.includes(dishName)) {
      removeDishFromBooking(dishName);
    } else {
      addDishToBill(dishName);
    }
  };

  const getButtonContent = (dishName) => {
    if (selectedDishes.includes(dishName)) {
      return 'Remove';
    } else {
      return 'Add ';
    }
  };

  return (
    <div className=' listed-dishes-row'>
      <div className='navigation-headers-dish-booking'>
        <p className='param-headers-dishes-for-booking'>
          Select Dish(es) by Chef
        </p>
        {/* <div className='second-search-bar'>
          <div className='search-icon'>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{
                color: '#667085',
                borderRadius: '4px',
                padding: '5px',
              }}
              size='lg'
            />
          </div>
          <input
            type='text'
            placeholder='Search for dish'
            className='search-bar2'
            onChange={search}
          />
        </div> */}
        <div className='navigation-buttons'>
          <FontAwesomeIcon
            icon={faChevronLeft}
            style={{
              color: '#EF6820',
              backgroundColor: '#F9FAFB',
              borderRadius: '4px',
              padding: '5px',
              margin: '5px',
              width: '24px',
              height: '24px',
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
              width: '24px',
              height: '24px',
            }}
            size='xl'
            onClick={dishScrollRightHandler}
            className='navigation-arrow'
          />
        </div>
      </div>
      {filteredItems.length > 0 ? (
        <div
          className='dishes-booking-scroll-container'
          // style={{ width: '47em' }}
          ref={dishContainerRef}
        >
          {filteredItems.map((dish, index) => (
            <div className='dish-card-booking' key={dish}>
              <img
                src={`${dishImageObjectURL}${getDishNameForURI(dish)}.webp`}
                alt={dish}
              />
              <div className='dish-details-booking'>
                <p className='dish-name-booking'>{dish}</p>
                <button
                  className={handleButtonClass(dish)}
                  onClick={() => handleButtonClick(dish)}
                >
                  {getButtonContent(dish)}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className='dishes-booking-scroll-container'
          // style={{ width: '47em' }}
          ref={dishContainerRef}
        >
          {dishes.map((dish, index) => (
            <div className='dish-card-booking' key={dish}>
              <div className='image-container-dish'>
                <img
                  className='image-with-gradient'
                  src={`${dishImageObjectURL}${getDishNameForURI(dish)}.webp`}
                  alt={dish}
                />
              </div>
              <div className='dish-details-booking'>
                <p className='dish-name-booking'>{dish}</p>
                <button
                  className={handleButtonClass(dish)}
                  onClick={() => handleButtonClick(dish)}
                >
                  {getButtonContent(dish)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DishesForBookingPage;
