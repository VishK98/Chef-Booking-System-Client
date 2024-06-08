import React, { useState } from 'react';
import './ProfileLeftComponent.css';
import userimage from '../../static/chefs/chefb.jpeg';

const EditButtonComponent = (props) => {
  return (
    <button className='edit-button' onClick={props.toggle}>
      Edit
    </button>
  );
};

const ProfileLeftComponent = ({ name, email, phoneNumber, address }) => {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [additionalAddressInfo, setAdditionalAddressInfo] = useState('');
  const [additionalPhoneNumberInfo, setAdditionalPhoneNumberInfo] =
    useState('');
  const [additionalEmailInfo, setAdditionalEmailInfo] = useState('');

  const isAddressSet = (value) => {
    return value !== '' && value;
  };

  function handleSubmit(e) {
    e.preventDefault();
    // Handle form submission if needed
  }

  return (
    <div className='profile-container'>
      <div className='user-profile-img'>
        <img src={userimage} alt='User' />
      </div>
      <div className='profile-form-container'>
        <form onSubmit={handleSubmit} className='profile-form'>
          <div className='profile-form-group'>
            <label htmlFor='name'>Name</label>
            <div className='form-box'>
              <p className='profile-info-text'>{name}</p>
            </div>
          </div>

          <div className='profile-form-group'>
            <label htmlFor='email'>Email</label>
            <div className='form-box'>
              <p className='profile-info-text'>{email}</p>
            </div>
          </div>

          <div className='profile-form-group'>
            <label htmlFor='phoneNumber'>Phone Number</label>
            <div className='form-box'>
              {phoneNumber ? (
                <p className='profile-info-text'>{phoneNumber}</p>
              ) : (
                <p className='profile-info-placeholder'>
                  Enter your phone number
                </p>
              )}
            </div>
          </div>

          <div className='profile-form-group'>
            <label htmlFor='address'>Address</label>
            <div className='form-box'>
              <div className='address-details-profile-left'>
                <p>
                  {address?.addressLine}
                  {isAddressSet(address?.addressLine) ? ',' : ''}
                </p>
                <p>
                  {address?.city}
                  {isAddressSet(address?.city) ? ',' : ''}
                </p>
                <p>
                  {address?.zipCode}
                  {isAddressSet(address?.zipCode) ? ',' : ''}
                </p>
                <p>{address?.state}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <EditButtonComponent />
    </div>
  );
};

export default ProfileLeftComponent;
