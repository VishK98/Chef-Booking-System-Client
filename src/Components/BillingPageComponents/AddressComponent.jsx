import React, { useState, useEffect } from 'react';
import './AddressComponent.css';
import axios from 'axios';

const AddressComponent = ({
  isAddressGiven,
  setIsAddressGiven,
  address,
  setAddress,
}) => {
  const isAddressSet = (value) => {
    if (value === '' || !value) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/getaddress`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('cowToken')}`,
            },
          }
        );
        setAddress(response.data.address);
        setIsAddressGiven(response.data.address.addressLine !== null);
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='address-line-booking'>
      {address.addressLine}
      {isAddressSet(address.addressLine) ? ',' : ''} {address.city}
      {isAddressSet(address.city) ? ',' : ''} {address.state}
      {isAddressSet(address.state) ? ',' : ''} {address.zipCode}
    </div>
  );
};

export default AddressComponent;
