import React, { useState } from 'react';
import './ProfileLeftComponent.css';
import userimage from '../../static/chefs/chefb.jpeg';
import AddressForm from '../../Components/BillingPageComponents/AddressForm';

const EditButtonComponent = (props) => {
  return (
    <button className='edit-button' onClick={props.toggle}>
      Edit
    </button>
  );
};

const ProfileLeftComponent = ({ name, email, phoneNumber, address }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const isAddressSet = (value) => {
    return value !== '' && value;
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleUpdateSuccess = () => {
    window.location.reload();
  };

  return (
    <div className='profile-container'>
      <div className='user-profile-img'>
        <img src={userimage} alt='User' />
      </div>
      <div className='profile-form-container'>
        <div className='profile-form'>
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
        </div>
      </div>
      <EditButtonComponent toggle={toggleFormVisibility} />
      {isFormVisible && (
        <AddressForm
          isAddressGiven={isAddressSet(address?.addressLine)}
          setIsAddressGiven={() => {}}
          address={address}
          setAddress={() => {}}
          toggle={toggleFormVisibility}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ProfileLeftComponent;
