import React from 'react';
import './TextAreaComponent.css';

const TextAreaComponent = ({ additionalInfo, setAdditionalInfo }) => {
  const handleInputChange = (event) => {
    setAdditionalInfo(event.target.value);
  };

  return (
    <form>
      <div className='dietary-restriction'>
        <label htmlFor='additional-info'>
          Dietary Restrictions / Additional Info
        </label>
        <textarea
          id='additional-info'
          className='input-area'
          rows='4'
          cols='50'
          placeholder='Enter additional instructions...'
          value={additionalInfo}
          onChange={handleInputChange}
        ></textarea>
      </div>
    </form>
  );
};

export default TextAreaComponent;
