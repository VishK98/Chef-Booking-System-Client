import React, { useState } from 'react';
import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './OnboardChefForm.css';

function OnboardChefForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'Australia',
    bio: '',
    yearsExperience: '',
    pricePerHour: '',
    skills: [],
    dailyAvailability: '',
    dishes: [],
    profilePicture: null,
    startTime: '',
    endTime: '',
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills') {
      // Determine whether the selected option is already in the array
      const setValues = new Set(formData.skills);
      if (setValues.has(value)) {
        setValues.delete(value); // Remove option if already selected
      } else {
        setValues.add(value); // Add option if not selected
      }
      setFormData({ ...formData, [name]: Array.from(setValues) });
    } else if (name === 'dishes') {
      // Split the comma-separated string into an array
      setFormData({ ...formData, [name]: value.split(',') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(async (key) => {
      if (key === 'skills') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    const validationErrors = validateForm(formData);
    console.log(formData, validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log(Object.keys(validationErrors).length);

      // Form submission logic goes here
      try {
        const payload = {};
        payload.chef = formData;
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/onboard`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('cowChefToken')}`,
            },
          }
        );
        console.log('apicall');
        // alert('Chef onboarded successfully!');
        // reset form
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          country: 'Australia',
          bio: '',
          yearsExperience: '',
          pricePerHour: '',
          skills: [],
          dailyAvailability: '',
          dishes: [],
          profilePicture: null,
          startTime: '',
          endTime: '',
        });
      } catch (error) {
        console.error('Error onboarding chef:', error);
        alert('Failed to onboard chef.');
      }
      console.log('Form submitted successfully!');
    } else {
      setErrors(validationErrors);
      console.log('Form incomplete!', errors.length);
      console.log(Object.keys(validationErrors).length);
    }
  };
  const validateForm = (data) => {
    const errors = {};
    // Basic validation rules
    if (!data.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    if (!data.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!data.city.trim()) {
      errors.city = 'City is required';
    }
    if (!data.state.trim()) {
      errors.state = 'State is required';
    }
    if (!data.zip.trim()) {
      errors.zip = 'Zip code is required';
    }
    if (!data.bio.trim()) {
      errors.bio = 'Bio is required';
    }
    if (!data.yearsExperience.trim()) {
      errors.yearsExperience = 'Years of experience is required';
    }
    if (!data.pricePerHour.trim()) {
      errors.pricePerHour = 'Price per hour is required';
    }
    if (data.skills.length === 0) {
      errors.skills = 'At least one skill is required';
    }
    if (data.dishes.length === 0) {
      errors.dishes = 'At least one dish is required';
    }
    if (!data.startTime.trim()) {
      errors.startTime = 'Start time is required';
    }
    if (!data.endTime.trim()) {
      errors.endTime = 'End time is required';
    }
    // Add more validation rules for other fields here
    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className='container mt-5 w-50'>
      <h2>Chef on Wheelz OnBoarding</h2>
      <form className='mb-2'>
        <div className='mb-2'>
          <label className='form-label'>Name</label>
          <input
            type='text'
            className='form-control'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && !formData.name && (
            <div className='error'>{errors.name}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>Email</label>
          <input
            type='email'
            className='form-control'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && !formData.email && (
            <div className='error'>{errors.email}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>Phone Number</label>
          <input
            type='text'
            className='form-control'
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && !formData.phoneNumber && (
            <div className='error'>{errors.phoneNumber}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>Address</label>
          <input
            type='text'
            className='form-control'
            name='address'
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && !formData.address && (
            <div className='error'>{errors.address}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>City</label>
          <input
            type='text'
            className='form-control'
            name='city'
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && !formData.city && (
            <div className='error'>{errors.city}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>State</label>
          <input
            type='text'
            className='form-control'
            name='state'
            value={formData.state}
            onChange={handleChange}
          />
          {errors.state && !formData.state && (
            <div className='error'>{errors.state}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>Zip Code</label>
          <input
            type='text'
            className='form-control'
            name='zip'
            value={formData.zip}
            onChange={handleChange}
          />
          {errors.zip && !formData.zip && (
            <div className='error'>{errors.zip}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>Country</label>
          <select
            className='form-select'
            name='country'
            value={formData.country}
            onChange={handleChange}
          >
            <option value='Australia'>Australia</option>
          </select>
        </div>
        <div className='mb-2'>
          <label className='form-label'>Bio</label>
          <textarea
            className='form-control'
            name='bio'
            value={formData.bio}
            onChange={handleChange}
          />
          {errors.bio && !formData.bio && (
            <div className='error'>{errors.bio}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>Years of Experience</label>
          <input
            type='number'
            className='form-control'
            name='yearsExperience'
            value={formData.yearsExperience}
            onChange={handleChange}
          />
          {errors.yearsExperience && !formData.yearsExperience && (
            <div className='error'>{errors.yearsExperience}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>Charges per Hour</label>
          <input
            type='number'
            className='form-control'
            name='pricePerHour'
            value={formData.pricePerHour}
            onChange={handleChange}
          />
          {errors.pricePerHour && !formData.pricePerHour && (
            <div className='error'>{errors.pricePerHour}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>
            Cuisine Expertise (select multiple)
          </label>
          <select
            multiple
            className='form-select'
            name='skills'
            value={formData.skills}
            onChange={handleChange}
            size='10'
          >
            {[
              'Indian',
              'Italian',
              'Mexican',
              'Latin',
              'Spanish',
              'Chinese',
              'Japanese',
              'Thai',
              'French',
              'Greek',
              'Brazilian',
              'Lebanese',
              'Korean',
              'Turkish',
              'Pakistani',
              'European',
              'Australian',
              'Norwegian',
              'Mediterranean',
            ].map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
          {errors.skills && !formData.skills.length && (
            <div className='error'>{errors.skills}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>Signature Dishes</label>
          <input
            type='text'
            className='form-control'
            name='dishes'
            value={formData.dishes}
            onChange={handleChange}
            placeholder='Add comma-separated dishes'
          />
          {errors.dishes && !formData.dishes.length && (
            <div className='error'>{errors.dishes}</div>
          )}
        </div>
        {/* <div className='mb-2'>
          <label className='form-label'>Profile Picture</label>
          <input
            type='file'
            className='form-control'
            name='profilePicture'
            onChange={handleChange}
          />
        </div> */}
        <div className='mb-2'>
          <label className='form-label'>Start Time</label>
          <input
            type='time'
            className='form-control'
            name='startTime'
            value={formData.startTime}
            onChange={handleChange}
          />
          {errors.startTime && !formData.startTime && (
            <div className='error'>{errors.startTime}</div>
          )}
        </div>
        <div className='mb-2'>
          <label className='form-label'>End Time</label>
          <input
            type='time'
            className='form-control'
            name='endTime'
            value={formData.endTime}
            onChange={handleChange}
          />
          {errors.endTime && !formData.endTime && (
            <div className='error'>{errors.endTime}</div>
          )}
        </div>
        <button
          type='submit'
          className='exampleClass'
          style={{ marginBottom: '5rem' }}
          onClick={handleSubmit}
        >
          <span>Submit</span>
        </button>
      </form>
    </div>
  );
}

export default OnboardChefForm;
