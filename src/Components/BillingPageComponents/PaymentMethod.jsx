import React, { useState } from 'react';

import './PaymentMethod.css';

const PaymentMethod = ({
  bookingClickhandler,
  selectedDishes,
  numberOfAdults,
  numberOfKids,
  selectedDate,
  selectedTime,
  isAddressGiven,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const canBook = () => {
    return (
      numberOfAdults + numberOfKids > 0 &&
      selectedDate != null &&
      selectedTime != null &&
      selectedDishes.length > 0 &&
      selectedOption != null &&
      isAddressGiven
    );
  };

  return (
    <div className='payment-method'>
      <p className='payment-method-header'>Select Payment Method</p>
      <div className='service-and-online'>
        <div className='payment-options'>
          <div className='pay-after-service'>
            <label htmlFor='pay-after-service' className='radio'>
              <input
                type='radio'
                id='pay-after-service'
                value='pay-after-service'
                checked={selectedOption === 'pay-after-service'}
                onChange={handleChange}
                className='radio_input'
              />
              <div className='radio__radio'></div> Pay after Service
            </label>
            <p className='payment-subtext'>Payment via Apple Pay accepted</p>
            <hr />
          </div>
          <div className='online-pay'>
            <label htmlFor='online' className='radio'>
              <input
                type='radio'
                id='online'
                value='online'
                checked={selectedOption === 'online'}
                onChange={handleChange}
                className='radio_input'
                disabled
              />
              <div className='radio__radio'></div> Online
            </label>
            <p className='payment-subtext'>
              Credit & Debit cards/ Paypal/ Wallets/ Net banking etc.
            </p>
          </div>
          <div className='book-session-after-payment-btn'>
            <button
              className='book-session-after-payment'
              disabled={!canBook()}
              onClick={bookingClickhandler}
            >
              Book Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
