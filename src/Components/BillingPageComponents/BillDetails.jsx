import { React, useEffect, useState, useContext } from 'react';
import './BillDetails.css';

import axios from 'axios';

const dishImageObjectURL =
  'https://chefonwheelz.s3.ap-south-1.amazonaws.com/dishes/';

const getDishNameForURI = (dishname) => {
  return dishname.replace(/\s+/g, '+');
};

const platFormFee = 5;
const minBookingHours = 2;

const BillDetails = ({
  chefData,
  selectedDishes,
  numberOfAdults,
  numberOfKids,
  platformFee,
  setPlatformFee,
  chefCharges,
  setChefCharges,
  promoDiscount,
  setPromoDiscount,
  tax,
  setTax,
}) => {
  const chefId = sessionStorage.getItem('chefId');
  const [pricePerHour, setPricePerHour] = useState(0);

  useEffect(() => {
    const fetchPricePerHour = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/getchefbyid`,
          { chefId: chefId }
        );
        setPricePerHour(response.data.chef.pricePerHour);
        setPlatformFee(platFormFee);
        setChefCharges(response.data.chef.pricePerHour * 2);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };
    fetchPricePerHour();
  }, [chefId]);

  return (
    <div className='bill-details-container'>
      <p className='bill-details-header'>Bill Details</p>
      {selectedDishes.length > 0 ? (
        <div className='selected-dishes-billing'>
          <p className='booking-conditions'>
            *Chef will be booked for atleast 2 hours and can cook maximum 2
            dishes during these 2 hours.
          </p>
          {selectedDishes.map((dish, index) => (
            <div className='selected-dish-card' key={index}>
              <img
                src={`${dishImageObjectURL}${getDishNameForURI(dish)}.webp`}
                alt={dish}
                style={{
                  width: '83px',
                  height: '53px',
                  borderRadius: '4px',
                }}
              />
              <div className='people-details'>
                <p className='dish-name-billing'>{dish}</p>
              </div>
            </div>
          ))}
          <div className='dish-subtotal-container'>
            <div className='dish-subtotal'>
              <div>Guests</div>
              <div>
                {numberOfAdults} Adults, {numberOfKids} Kids
              </div>
            </div>
            <div className='dish-subtotal'>
              <div>Sub-Total</div>{' '}
              <div>
                + $ {pricePerHour} * {minBookingHours} = ${' '}
                {pricePerHour * minBookingHours}
              </div>
            </div>
            <div className='dish-subtotal'>
              <div>Platform Fee</div> <div>+ $ 5.00</div>
            </div>
            <div className='dish-subtotal'>
              <div>Promotional Discount</div>{' '}
              <div>{`- $ ${promoDiscount}.00`}</div>
            </div>
          </div>
          <div className='dish-total'>
            <div>Total</div>{' '}
            <div>
              $ {pricePerHour * minBookingHours + platFormFee - promoDiscount}
            </div>
          </div>
        </div>
      ) : (
        <div className='selected-dishes-billing'>
          <p className='no-items-selected'>No items selected</p>
        </div>
      )}
    </div>
  );
};

export default BillDetails;
