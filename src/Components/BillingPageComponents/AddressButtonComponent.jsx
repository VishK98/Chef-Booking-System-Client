import React from 'react';
import './AddressButtonComponent.css';

const AddressButtonComponent = (props) => {
  return (
    <div className='address-btn-main'>
      <button className='address-add-button' onClick={props.toggle}>
        Edit Address
      </button>
    </div>
  );
};

export default AddressButtonComponent;
