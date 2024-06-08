import React, { useState, useEffect } from 'react';
import './ChefInfoComponent.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faStar } from '@fortawesome/free-solid-svg-icons';
import Verified from '../../static/svgs/verification.png';

const chefImageUrl = require('../../static/chefs/chefa.jpeg');

const ChefInfoComponent = () => {
  const chefId = sessionStorage.getItem('chefId');

  const [cuisines, setCuisines] = useState([]);
  const [chefName, setChefName] = useState(null);
  const [chefRating, setChefRating] = useState(null);
  const [chefPricePerHour, setChefPricePerHour] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/getchefbyid`,
          {
            chefId: `${chefId}`,
          }
        );
        setCuisines(response.data.chef.skills);
        setChefName(response.data.chef.name);
        setChefRating(response.data.chef.rating);
        setChefPricePerHour(response.data.chef.pricePerHour);
      } catch (error) {
        console.error('Error fetching cuisines:', error);
      }
    };

    fetchDetails();
  }, [chefId]);

  return (
    <div className='chef-card-chefforbookingpage'>
      <div className='chef-info-chefforbookingpage'>
        <div className='chef-image-chefforbookingpage'>
          <img src={chefImageUrl} alt='Chef' />
        </div>
        <div className='chef-detail-chefforbookingpage'>
          <div className='chef-detail-chefforbookingpage-left'>
            <div className='chef-name-chefforbookingpage'>
              {chefName}
              <span className='space-between'></span>
              {`$${chefPricePerHour}/hour`}
            </div>
          </div>
          <div className='verifiedinfo'>
            <div className='verified-div'>
              <img src={Verified} alt='Verified' />
              <div className='verified-chefforbookingpage'>Verified</div>
              <div className='chef-info-right-chefforbookingpage'></div>
            </div>
            <div className='chef-rating-chefforbookingpage'>
              <FontAwesomeIcon
                icon={faStar}
                style={{ color: '#EF6820' }}
                size='sm'
              />
              {chefRating} (80 reviews)
            </div>
          </div>
        </div>
      </div>
      <p className='add-more-dishes'>Add more dishes</p>
      <div className='chef-skills-chefforbookingpage'>
        {cuisines.map((skill, index) => (
          <div key={index} className='skill-pill-chefforbookingpage'>
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefInfoComponent;
