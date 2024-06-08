import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faCaretDown,
  faLocationArrow,
} from '@fortawesome/free-solid-svg-icons';
import './AddressAutosuggest.css'; // Make sure you have this CSS file in the same directory
import locationicon from '../../src/static/location-icon.svg';

const AddressAutosuggest = ({ setAddress }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputCaretRef = useRef(null);
  const suggestionsListRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        inputCaretRef.current &&
        !inputCaretRef.current.contains(e.target) &&
        suggestionsListRef.current &&
        !suggestionsListRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    // Ensure that refs are not null
    if (inputCaretRef.current && suggestionsListRef.current) {
      window.addEventListener('click', handleOutsideClick);
    }

    return () => {
      if (inputCaretRef.current && suggestionsListRef.current) {
        window.removeEventListener('click', handleOutsideClick);
      }
    };
  }, []);

  // Fetch user's location when the component mounts
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=in,au`
        );
        setQuery(response.data.display_name);
      } catch (error) {
        console.error('Error fetching the current location:', error);
      }
    });
  }, []);

  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in,au&q=${encodeURIComponent(query)}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 500); // Debounce requests
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (selected) => {
    setQuery(selected);
    extractAddress(selected);
    setShowSuggestions(false);
  };

  // Extract address from displayName
  const extractAddress = (displayName) => {
    const parts = displayName.split(', ');

    const street = parts[0] + ', ' + parts[1] + ', ' + parts[3];
    const city = parts[parts.length - 5];
    const country = parts[parts.length - 1];
    const state = parts[parts.length - 3];
    const zipCode = parts[parts.length - 2];
    if (setAddress) {
      setAddress({
        addressLine: street,
        city,
        country,
        state,
        zipCode,
      });
    }
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=in,au`
          );

          if (setAddress) {
            setAddress({
              addressLine:
                response.data.address.house_number +
                ', ' +
                response.data.address.road +
                ', ' +
                response.data.address.suburb,
              city: response.data.address.city,
              state: response.data.address.state,
              zipCode: response.data.address.postcode,
            });
          }

          setQuery(response.data.display_name);

          setShowSuggestions(false);
        } catch (error) {
          console.error('Error fetching the current location:', error);
        }
      },
      (error) => {
        console.error('Error detecting the current location:', error);
      }
    );
  };

  return (
    <div className='autosuggest-container'>
      <div className='input-icon-container'>
        <img
          src={locationicon}
          className='input-icon'
          style={{
            color: '#107569',
            borderRadius: '4px',
            width: '20px',
            height: '20px',
          }}
          size='xl'
          alt=''
        />
        <input
          className='autosuggest-input'
          type='text'
          placeholder='Type your Location'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }} // Always open suggestions on change
          onClick={() => setShowSuggestions(true)} // Open suggestions on click
        />

        <FontAwesomeIcon
          ref={inputCaretRef}
          icon={faCaretDown}
          style={{
            color: '#107569',
            borderRadius: '4px',
            padding: '5px',
            margin: '5px',
            width: '20px',
            height: '20px',
          }}
          size='xl'
          className={`input-caret ${showSuggestions ? 'rotate' : ''}`}
          onClick={() => {
            setQuery(''); // Clear the input field
            setShowSuggestions(!showSuggestions);
          }}
        />
      </div>
      {showSuggestions && (
        <ul ref={suggestionsListRef} className='suggestions-list'>
          <li className='suggestion-item' onClick={detectLocation}>
            <FontAwesomeIcon
              style={{
                color: '#107569',
                borderRadius: '4px',
                width: '20px',
                height: '20px',
              }}
              icon={faLocationArrow}
              className='detect-location-icon'
            />{' '}
            Detect my location
          </li>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className='suggestion-item'
              onClick={() => handleSelect(suggestion.display_name)}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutosuggest;
