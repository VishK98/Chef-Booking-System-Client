import React, { useState } from 'react';
import './SavedAddressComponent.css';
import AddressForm from '../../Components/BillingPageComponents/AddressForm';
import axios from 'axios';

const SavedAddressComponent = ({ name, address }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

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
          window.location.reload();
          localStorage.setItem('afterUpdate', 'true');
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

  const handleUpdateSuccess = () => {
    window.location.reload();
  };

  const renderAddressDetails = () => {
    if (!address) {
      return <div></div>; // Render a blank div if address is null
    }

    return (
      <div className='saved-address-card'>
        <div className='button-container'>
          <p className='address-card-name'>{name}</p>
          <button>Home</button>
        </div>
        <div className='address-details'>
          <p>
            {address.addressLine}
            {isAddressSet(address.addressLine) ? ',' : ''}
          </p>
          <p>
            {address.city}
            {isAddressSet(address.city) ? ',' : ''}
          </p>
          <p>
            {address.zipCode}
            {isAddressSet(address.zipCode) ? ',' : ''}
          </p>
          <p>{address.state}</p>
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
          address={address}
          setAddress={() => {}}
          toggle={toggleFormVisibility}
          onUpdateSuccess={handleUpdateSuccess} // Pass the callback function
        />
      )}
    </div>
  );
};

export default SavedAddressComponent;
