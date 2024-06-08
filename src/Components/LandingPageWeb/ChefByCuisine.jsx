import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChefByCuisine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from 'react-bootstrap';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const cuisineImageObjectURL =
  'https://chefonwheelz.s3.ap-south-1.amazonaws.com/cuisines/';

const ChefByCuisine = () => {
  const [cuisines, setCuisines] = useState([]);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const cuisineContainerRef = useRef(null);
  const cuisineContainerTwoRef = useRef(null);
  const navigate = useNavigate();
  const [filteredItems, setFilteredItems] = useState([]);
  const cuisineContainerThreeRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const search = (e) => {
    let params = e.target.value;
    let filteredCuisines = cuisines.filter((cuisine) => {
      let name = cuisine.name;
      return name.toString().toLowerCase().includes(params);
    });
    if (!params) setFilteredItems([]);
    else setFilteredItems(filteredCuisines);
    return;
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_ENDPOINT}/api/cuisines/`)
      .then((response) => {
        setCuisines(response.data.cuisines);
        updateTotalPages();
      })
      .catch((error) => {
        console.error('Error fetching cuisines:', error);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container =
        cuisineContainerRef.current || cuisineContainerTwoRef.current;
      if (container) {
        const currentPageNumber = Math.ceil(
          container.scrollLeft / container.offsetWidth
        );
        setCurrentPage(currentPageNumber + 1);
      }
    };

    if (cuisineContainerRef.current) {
      cuisineContainerRef.current.addEventListener('scroll', handleScroll);
    }
    if (cuisineContainerTwoRef.current) {
      cuisineContainerTwoRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (cuisineContainerRef.current) {
        cuisineContainerRef.current.removeEventListener('scroll', handleScroll);
      }
      if (cuisineContainerTwoRef.current) {
        cuisineContainerTwoRef.current.removeEventListener(
          'scroll',
          handleScroll
        );
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const updateTotalPages = () => {
    const container = cuisineContainerRef.current;
    if (container) {
      const totalWidth = container.scrollWidth;
      const viewWidth = container.clientWidth;
      const totalPages = Math.ceil(totalWidth / viewWidth);
      setTotalPages(totalPages);
    }
  };

  const cuisineScrollLeftHandler = () => {
    if (cuisineContainerRef.current) {
      const cardWidth = cuisineContainerRef.current.children[0].offsetWidth;
      const newScrollLeft = scrollLeft - cardWidth;
      cuisineContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      cuisineContainerTwoRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      setScrollLeft(newScrollLeft);
    }
  };

  const cuisineScrollRightHandler = () => {
    if (cuisineContainerRef.current) {
      const cardWidth = cuisineContainerRef.current.children[0].offsetWidth;
      const newScrollLeft = scrollLeft + cardWidth;
      cuisineContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      cuisineContainerTwoRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      setScrollLeft(newScrollLeft);
    }
  };

  const cuisineClickHandler = (cuisineName) => {
    navigate(`/chefs-by-cuisine/${encodeURIComponent(cuisineName)}`);
  };

  const handleDotClick = (index) => {
    if (cuisineContainerRef.current) {
      const cardWidth = cuisineContainerRef.current.children[0].offsetWidth;
      const newScrollLeft = index * cardWidth;
      cuisineContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      cuisineContainerTwoRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      setCurrentPage(index + 1); // Update currentPage based on the clicked dot
    }
  };

  return (
    <Container>
      <div className='chef-by-cuisines-row mt-4'>
        <div className=' navigation-headers'>
          <div className=' navigation-controls'>
            <h2 className='param-headers'>Chef by Cuisines</h2>
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
                onClick={cuisineScrollLeftHandler}
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
                onClick={cuisineScrollRightHandler}
                className='navigation-arrow'
              />
            </div>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div
            className='dishes-scroll-container'
            ref={cuisineContainerThreeRef}
          >
            {filteredItems.map((item) => (
              <div
                className='dish-card'
                key={item.name}
                onClick={() => cuisineClickHandler(item.name)}
              >
                <div className='dish-inner'>
                  <img
                    id='cuisineId'
                    src={`${cuisineImageObjectURL}${item.name}.webp`}
                    alt={item.name}
                  />
                </div>
                <p className='dish-name'>{item.name}</p>
              </div>
            ))}
          </div>
        ) : windowWidth <= 786 ? (
          <div className='combined-scroll-container'>
            {cuisines.map((cuisine, index) => (
              <div
                className='cuisine-card'
                key={cuisine.name}
                onClick={() => cuisineClickHandler(cuisine.name)}
              >
                <div className='cuisine-inner'>
                  <img
                    src={`${cuisineImageObjectURL}${cuisine.name}.webp`}
                    alt={cuisine.name}
                  />
                </div>
                <p className='cuisine-name'>{cuisine.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div
              className='cuisines-scroll-container'
              ref={cuisineContainerRef}
            >
              {cuisines
                .filter((cuisine, i) => i % 2 === 0)
                .map((cuisine) => (
                  <div
                    className='cuisine-card'
                    key={cuisine.name}
                    onClick={() => cuisineClickHandler(cuisine.name)}
                  >
                    <div className='cuisine-inner'>
                      <img
                        src={`${cuisineImageObjectURL}${cuisine.name}.webp`}
                        alt={cuisine.name}
                      />
                    </div>
                    <p className='cuisine-name'>{cuisine.name}</p>
                  </div>
                ))}
            </div>

            <div
              className='cuisines-scroll-container'
              ref={cuisineContainerTwoRef}
            >
              {cuisines
                .filter((cuisine, i) => i % 2 === 1)
                .map((cuisine) => (
                  <div
                    className='cuisine-card'
                    key={cuisine.name}
                    onClick={() => cuisineClickHandler(cuisine.name)}
                  >
                    <div className='cuisine-inner'>
                      <img
                        src={`${cuisineImageObjectURL}${cuisine.name}.webp`}
                        alt={cuisine.name}
                      />
                    </div>
                    <p className='cuisine-name'>{cuisine.name}</p>
                  </div>
                ))}
            </div>
          </>
        )}

        <div className='pagination-dots'>
          {[...Array(totalPages).keys()].map((idx) => (
            <span
              key={idx}
              className={currentPage === idx + 1 ? 'active-dot' : 'dot'}
              onClick={() => handleDotClick(idx)}
            ></span>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ChefByCuisine;
