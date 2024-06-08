import { React, useEffect, useState } from 'react';
import './AddressForm.css';
import axios from 'axios';
import AddressAutosuggest from '../AddressAutoSuggest';
import Closebtn from '../../static/x-close.png';

const AddressForm = (props) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    addressLine: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [isAddressUpdated, setIsAddressUpdated] = useState(false);
  const {
    isAddressGiven,
    setIsAddressGiven,
    address,
    setAddress,
    toggle,
    onUpdateSuccess,
  } = props;

  const handleInputChange = (e) => {
    setIsAddressUpdated(true);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.phoneNumber === '' ||
      formData.addressLine === '' ||
      formData.city === '' ||
      formData.state === '' ||
      formData.zipCode === ''
    ) {
      console.log('Empty Form value.');
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/postaddress`,
        {
          phoneNumber: formData.phoneNumber,
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cowToken')}`,
          },
        }
      );
      setIsAddressGiven(true);
      setAddress({
        ...address,
        phoneNumber: formData.phoneNumber,
        addressLine: formData.addressLine,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });
      onUpdateSuccess();
      localStorage.setItem('afterUpdate', 'true');
      console.log('afterUpdate set to true');
    } catch (error) {
      console.error('Error updating address.', error);
    }
    toggle();
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
        setFormData({
          ...formData,
          phoneNumber: response.data.phoneNumber,
          addressLine: response.data.address.addressLine,
          city: response.data.address.city,
          state: response.data.address.state,
          zipCode: response.data.address.zipCode,
        });
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };
    fetchData();
  }, []);

  const setAddressUpdated = ({ addressLine, city, state, zipCode }) => {
    setIsAddressUpdated(true);
    if (addressLine && city && state && zipCode) {
      setFormData({
        ...formData,
        addressLine,
        city,
        state,
        zipCode,
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    toggle(); // Close the popup
  };

  return (
    <div className='popup'>
      <div className='booking-form-container'>
        <form onSubmit={handleSubmit} className='registration-form'>
          <div className='adressXclose'>
            <p>Address</p>
            <img
              src={Closebtn}
              alt='Close Button'
              className='close-button'
              onClick={handleCancel}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='phoneNumber'>Phone Number</label>
            <div className='address-line-style'>
              <input
                type='text'
                name='phoneNumber'
                className='input-field'
                placeholder={formData.phoneNumber}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
              <div className='adressinput '>
                <AddressAutosuggest setAddress={setAddressUpdated} />
              </div>
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='addressLine'>Address Line</label>
            <input
              type='text'
              name='addressLine'
              className='input-field'
              placeholder={formData.addressLine}
              value={formData.addressLine}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className='form-group city-state-zip'>
            <div className='city-state-zip-group'>
              <label htmlFor='city'>City</label>
              <input
                type='text'
                name='city'
                className='input-field'
                placeholder={formData.city}
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='city-state-zip-group'>
              <label htmlFor='state'>State</label>
              <input
                type='text'
                name='state'
                className='input-field'
                placeholder={formData.state}
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='city-state-zip-group'>
              <label htmlFor='zipCode'>Zip</label>
              <input
                type='text'
                name='zipCode'
                className='input-field'
                placeholder={formData.zipCode}
                value={formData.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button className='dismiss-button' onClick={handleCancel}>
            Cancel
          </button>
          <button
            className='update-address-button'
            disabled={!isAddressUpdated}
          >
            Update Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
