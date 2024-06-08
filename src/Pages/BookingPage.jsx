import React, { useState, useEffect, useContext } from 'react';
import './BookingPage.css';
import axios from 'axios';
import DateTimePicker from '../Components/BillingPageComponents/DateTimePicker';
import PeopleSelector from '../Components/BillingPageComponents/PeopleSelector';
import AddressForm from '../Components/BillingPageComponents/AddressForm';
import DishesForBookingPage from '../Components/BillingPageComponents/DishesForBookingPage';
import BillDetails from '../Components/BillingPageComponents/BillDetails';
import ChefInfoComponent from '../Components/BillingPageComponents/ChefInfoComponent';
import PaymentMethod from '../Components/BillingPageComponents/PaymentMethod';
// import NavBar from '../Components/NavBar';
import TextAreaComponent from '../Components/BillingPageComponents/TextAreaComponent';
import AddressButtonComponent from '../Components/BillingPageComponents/AddressButtonComponent';
import AddressComponent from '../Components/BillingPageComponents/AddressComponent';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const chefId = sessionStorage.getItem('chefId');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [numberOfAdults, setNumberOfAdults] = useState(0);
  const [numberOfKids, setNumberOfKids] = useState(0);
  const [chefData, setchefData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [platformFee, setPlatformFee] = useState(5);
  const [chefCharges, setChefCharges] = useState(0);
  const [promoDiscount, setPromoDiscount] = useState(5);
  const [tax, setTax] = useState(0);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [seen, setSeen] = useState(false);
  const [isAddressGiven, setIsAddressGiven] = useState(false);
  const [address, setAddress] = useState({});

  const navigate = useNavigate();

  const bookingClickhandler = async () => {
    let [hours, minutesStr] = selectedTime.split(':');
    const [minutes, amPm] = minutesStr.split(' ');
    if (amPm === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    const startTime = new Date(
      new Date().getFullYear(),
      selectedMonth,
      selectedDate,
      hours,
      parseInt(minutes, 10)
    );
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 2);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/book`,
        {
          chefId: chefId,
          startTime,
          endTime,
          bookingTime: new Date(),
          dishDetails: selectedDishes,
          subTotal: chefCharges,
          platformFee: platformFee,
          promoDiscount: promoDiscount,
          tax: tax,
          totalFee: chefCharges + platformFee - promoDiscount,
          adultCount: numberOfAdults,
          childCount: numberOfKids,
          additionalInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cowToken')}`,
          },
        }
      );
      if (window.innerWidth <= 786) {
        navigate('/usersessions');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error while booking', error);
    }
  };

  const togglePop = () => {
    setSeen(!seen);
  };

  const handleSelectDishes = (dishes) => {
    setSelectedDishes(dishes);
  };

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/getchefbyid`,
          {
            chefId: `${chefId}`,
          }
        );
        setchefData(response.data.chef);
      } catch (error) {
        console.error('Error fetching chefs:', error);
      }
    };
    fetchChef();
  }, []);

  return (
    <>
      <div className='booking-page-main'>
        <div className='booking-page-left'>
          <DishesForBookingPage
            chefId={chefId}
            onSelectDishes={handleSelectDishes}
          />
          <PeopleSelector
            numberOfAdults={numberOfAdults}
            setNumberOfAdults={setNumberOfAdults}
            numberOfKids={numberOfKids}
            setNumberOfKids={setNumberOfKids}
          />
          <DateTimePicker
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
          <TextAreaComponent
            additionalInfo={additionalInfo}
            setAdditionalInfo={setAdditionalInfo}
          />
          <div className='input_box_Card'>
            <div className='AddressCard'>
              <p className='AddressCard-Title'>Address</p>
              <AddressComponent
                isAddressGiven={isAddressGiven}
                setIsAddressGiven={setIsAddressGiven}
                address={address}
                setAddress={setAddress}
              />
              <>
                {seen ? (
                  <AddressForm
                    toggle={togglePop}
                    isAddressGiven={isAddressGiven}
                    setIsAddressGiven={setIsAddressGiven}
                    address={address}
                    setAddress={setAddress}
                  />
                ) : (
                  <AddressButtonComponent
                    toggle={togglePop}
                    isAddressGiven={isAddressGiven}
                    setIsAddressGiven={setIsAddressGiven}
                  />
                )}
              </>
            </div>
          </div>
        </div>
        <div className='booking-page-right'>
          <div className='webpage-chef'>
            <ChefInfoComponent chefId={chefId} />
          </div>
          <BillDetails
            selectedDishes={selectedDishes}
            numberOfAdults={numberOfAdults}
            numberOfKids={numberOfKids}
            chefId={chefId}
            platformFee={platformFee}
            setPlatformFee={setPlatformFee}
            chefCharges={chefCharges}
            setChefCharges={setChefCharges}
            promoDiscount={promoDiscount}
            setPromoDiscount={setPromoDiscount}
            tax={tax}
            setTax={setTax}
          />
          <PaymentMethod
            bookingClickhandler={bookingClickhandler}
            selectedDishes={selectedDishes}
            numberOfAdults={numberOfAdults}
            numberOfKids={numberOfKids}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            isAddressGiven={isAddressGiven}
          />
        </div>
        <div className='mobile-view-chef'>
          <ChefInfoComponent chefId={chefId} />
        </div>
      </div>
    </>
  );
};

export default BookingPage;
