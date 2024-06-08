import React, { useState } from 'react';
import './ChefProfileCard.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ProfilePhoto from '../../ProfilePhoto';

const ChefProfileCard = ({ chefDetails }) => {
  const [isEditingImage, setIsEditingImage] = useState(false);
  console.log(chefDetails.image);
  const updateChefImage = async (event) => {
    // const selectedImage = event.target.files[0];
    // console.log(selectedImage);
    const formData = new FormData();
    formData.append('image', event.file);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cowChefToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then((response) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='chef-profile-card'>
      <div>
        <ProfilePhoto
          updateChefImage={updateChefImage}
          chefImage={chefDetails.image}
        />
      </div>
      <p className='chef-profile-label'>Name</p>
      <p className='chef-profile-details'>{chefDetails.name}</p>
      <p className='chef-profile-label'>Email</p>
      <p className='chef-profile-details'>{chefDetails.email}</p>
      <p className='chef-profile-label'>Contact number</p>
      <p className='chef-profile-details'>{chefDetails.phoneNumber}</p>
      <p className='chef-profile-label'>Cuisines</p>
      <div className='chef-skills-profile-page'>
        {chefDetails.skills &&
          chefDetails.skills.map((item, index) => (
            <span className='chef-skill-pills-profile-page' key={index}>
              {item}
            </span>
          ))}
      </div>
      <p className='chef-profile-label'>Bio</p>
      <p className='chef-profile-details'>{chefDetails.bio}</p>
    </div>
  );
};

export default ChefProfileCard;
