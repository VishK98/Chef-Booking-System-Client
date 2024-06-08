import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Import your CSS file for styling
import searchlogo from '../../src/static/search-md.svg'; // Import your logo image

const SearchBar = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState(['Pasta', 'Indian', 'Hetvi Bharoliya']);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  const handleInputClick = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Selected suggestion:', suggestion);
    if (suggestion === 'Pasta') {
      navigate(`/chefs-by-dish/${suggestion}`);
    } else if (suggestion === 'Indian') {
      navigate(`/chefs-by-cuisine/${suggestion}`);
    } else if (suggestion === 'Hetvi Bharoliya') {
      const chefId = '65ea8ba49ba13c0efc4d3686';
      sessionStorage.setItem('chefId', chefId);
      navigate('/booking');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    if (suggestionsRef.current) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (suggestionsRef.current) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [suggestionsRef]);

  return (
    <div className='search-bar'>
      <img src={searchlogo} alt='Logo' className='logo-search' />
      <input
        type='text'
        placeholder='Search for dish by chef'
        className='search-input'
        onClick={handleInputClick}
      />
      {showSuggestions && (
        <div ref={suggestionsRef} className='suggestions-popup'>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className='suggestion-item'
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
