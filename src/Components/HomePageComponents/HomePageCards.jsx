import React, { useState } from 'react';
import './HomePageCards.css';
import homepage1 from '../../static/homepage/homepage1.png';
import homepage2 from '../../static/homepage/homepage2.png';
import homepage3 from '../../static/homepage/homepage3.png';
import { Container, Col } from 'react-bootstrap';

const HomePageCards = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const images = [
    {
      src: homepage1,
      content: {
        step1: 'Step 1',
        selection:
          'Handpick your preferred chef, select authentic cuisines, or delight in signature dishes',
        substep: 'Select a Chef',
      },
    },
    {
      src: homepage2,
      content: {
        step1: 'Step 2',
        selection:
          'Select the perfect date and time to customize your culinary event to fit seamlessly into your schedule',
        substep: 'Select Date and Time',
      },
    },
    {
      src: homepage3,
      content: {
        step1: 'Step 3',
        selection:
          'Confirm and Indulge by booking your slot and anticipating the gastronomic delight ahead.',
        substep: 'Book your slot',
      },
    },
  ];

  const handleImageChange = (index) => {
    setActiveIndex(index);
  };

  return (
    <Container>
      <div className='homepage-container mt-4'>
        <Col lg={6} className='mb-3 mb-lg-0'>
          <div className='text-container '>
            <h1 className='homepage-main-header-text mb-4'>
              Bringing culinary <br /> delights to your doorstep
            </h1>
            <div className='typing-effect'>
              <p className='selection'>
                {images[activeIndex].content.selection}
              </p>
            </div>
          </div>
        </Col>
        <Col lg={6} className='mb-3 mb-lg-0'>
          <div className='image-container'>
            <div className='gallery'>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`img-box ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => handleImageChange(index)}
                  onMouseEnter={() => handleImageChange(index)}
                  style={{ backgroundImage: `url(${image.src})` }}
                >
                  <div
                    className='glass'
                    // style={{
                    //   position: 'absolute',
                    //   bottom: 0,
                    //   width: '100%',
                    //   backgroundColor: 'lightblue',
                    //   textAlign: 'center',
                    // }}
                  >
                    <p className='p-top'>Step {index + 1}</p>
                    <p className='p-bottom'>
                      {images[activeIndex].content.substep}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </div>
    </Container>
  );
};

export default HomePageCards;
