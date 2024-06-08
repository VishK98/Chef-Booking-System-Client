import React, { useState } from 'react';
import './SavedAddressComponent.css';
import AddressForm from '../../Components/BillingPageComponents/AddressForm';
import axios from 'axios';

const SavedAddressComponent = ({ name, address }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(address);

  const isAddressSet = (value) => {
    return value !== '' && value;
  };

  const editButton = () => {
    console.log('Clicked Edit');
    setIsFormVisible(true);
  };

  const deleteButton = () => {
    console.log('Clicked Delete');
    const token = localStorage.getItem('cowToken');
    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .post('http://localhost:8080/api/users/deleteaddress', null, {
          headers,
        })
        .then((response) => {
          console.log('Delete request successful');
          console.log(response.data);
          // Update the state to remove the deleted address
          setCurrentAddress(null);
        })
        .catch((error) => {
          console.error('Error deleting address:', error);
        });
    } else {
      console.error('Bearer token not found');
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleUpdateSuccess = (updatedAddress) => {
    // Update the state with the updated address
    setCurrentAddress(updatedAddress);
    setIsFormVisible(false);
  };

  // Conditionally render the address details or a blank div
  const renderAddressDetails = () => {
    if (!currentAddress) {
      return <div style={{ marginBottom: '30px' }}>No address available.</div>; // Render a message if address is null
    }
    return (
      <div className='saved-address-card'>
        <div className='button-container'>
          <p className='address-card-name'>{name}</p>
          <button>Home</button>
        </div>
        <div className='address-details'>
          <p>
            {currentAddress.addressLine}
            {isAddressSet(currentAddress.addressLine) ? ',' : ''}
          </p>
          <p>
            {currentAddress.city}
            {isAddressSet(currentAddress.city) ? ',' : ''}
          </p>
          <p>
            {currentAddress.zipCode}
            {isAddressSet(currentAddress.zipCode) ? ',' : ''}
          </p>
          <p>{currentAddress.state}</p>
        </div>
        <div className='edit-address-buttons-div'>
          <button className='edit-address-button' onClick={editButton}>
            Edit
          </button>
          <button className='delete-address-button' onClick={deleteButton}>
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderAddressDetails()}
      <button className='add-new-address' onClick={toggleFormVisibility}>
        Add New Address
      </button>

      {isFormVisible && (
        <AddressForm
          isAddressGiven={isAddressSet(address?.addressLine)}
          setIsAddressGiven={() => {}}
          address={currentAddress}
          setAddress={setCurrentAddress}
          toggle={toggleFormVisibility}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default SavedAddressComponent;
