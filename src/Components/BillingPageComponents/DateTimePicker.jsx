import React, { useState, useEffect, useContext } from 'react';
import './DateTimePicker.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const generateAvailableTimes = (serviceStartTime, serviceEndTime) => {
  const availableTimes = [];
  let startTime = new Date(serviceStartTime);
  const endTime = new Date(serviceEndTime);
  while (startTime < endTime) {
    availableTimes.push(
      startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
    startTime.setHours(startTime.getHours() + 2);
  }
  return availableTimes;
};

// const generateAvailableTimes = (serviceStartTime, serviceEndTime) => {
//   const availableTimes = [];
//   let startTime = new Date(serviceStartTime);
//   const endTime = new Date(serviceEndTime);
//   const currentTime = new Date();

//   // Ensure startTime's hours are in the future
//   while (startTime < endTime) {
//     if (startTime.getHours() > currentTime.getHours()) {
//       availableTimes.push(
//         startTime.toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         })
//       );
//     }
//     startTime.setHours(startTime.getHours() + 2);
//   }
//   return availableTimes;
// };

// const getFormattedStartTimes = (timeString, selectedMonth, selectedDate) => {
//   let [hours, minutesStr] = timeString.split(':');
//   const [minutes, amPm] = minutesStr.split(' ');
//   if (amPm === 'PM') {
//     hours = parseInt(hours, 10) + 12;
//   }
//   let formattedStartTime = new Date(
//     new Date().getFullYear(),
//     selectedMonth,
//     selectedDate,
//     hours,
//     parseInt(minutes, 10)
//   );
//   return new Date(formattedStartTime).toISOString();
// };

const getFormattedStartTimes = (timeString, selectedMonth, selectedDate) => {
  let [hours, minutesStr] = timeString.split(':');
  const [minutes, amPm] = minutesStr.split(' ');
  if (amPm === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  // Construct the start time
  let formattedStartTime = new Date(
    new Date().getFullYear(),
    selectedMonth,
    selectedDate,
    hours,
    parseInt(minutes, 10)
  );

  // Get the current time
  const currentTime = new Date();

  // Compare with the current time
  if (formattedStartTime > currentTime) {
    return formattedStartTime.toISOString();
  } else {
    return null; // Return null for times that are not in the future
  }
};

const TimePicker = ({
  selectedMonth,
  selectedDate,
  selectedTime,
  setSelectedTime,
}) => {
  const [chef, setChef] = useState(null);
  const [chefBookings, setChefBookings] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const chefId = sessionStorage.getItem('chefId');

  useEffect(() => {
    const fetchChefBookingDetails = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/getchefbookings`,
          { chefId: chefId }
        );
        setChefBookings(response.data.bookings);
      } catch (error) {
        console.error('Error fetching chef details:', error);
      }
    };
    fetchChefBookingDetails();
  }, [chefId]);

  useEffect(() => {
    if (chef && selectedMonth && selectedDate) {
      const startTimeOfBookings = chefBookings.map(
        (booking) => booking.startTime
      );
      const initialAvailableTimes = generateAvailableTimes(
        chef.serviceStartTime,
        chef.serviceEndTime
      );
      const finalAvailableTimes = [];
      for (let timeStringIndex in initialAvailableTimes) {
        // if (
        //   !startTimeOfBookings.includes(
        //     getFormattedStartTimes(
        //       initialAvailableTimes[timeStringIndex],
        //       selectedMonth,
        //       selectedDate
        //     )
        //   )
        // ) {
        //   finalAvailableTimes.push(initialAvailableTimes[timeStringIndex]);
        // }
        let result = getFormattedStartTimes(
          initialAvailableTimes[timeStringIndex],
          selectedMonth,
          selectedDate
        );
        if (result !== null && !startTimeOfBookings.includes(result)) {
          finalAvailableTimes.push(initialAvailableTimes[timeStringIndex]);
        }
      }
      setAvailableTimes(finalAvailableTimes);
    }
  }, [chef, selectedMonth, selectedDate, chefBookings]);

  useEffect(() => {
    const fetchChefDetails = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/chefs/getchefbyid`,
          { chefId: chefId }
        );
        setChef(response.data.chef);
      } catch (error) {
        console.error('Error fetching chef details:', error);
      }
    };
    fetchChefDetails();
  }, [chefId]);

  return (
    <div className='select-time'>
      <p>Select Time</p>
      <div className='time-picker'>
        <div className='time-pills-container'>
          {availableTimes.map((time, index) => (
            <div
              key={index}
              className={`time-pill ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => {
                if (selectedDate) {
                  setSelectedTime(time);
                  // console.log(
                  //     "Selected Date Time:",
                  //     selectedDate,
                  //     time
                  // );
                }
              }}
            >
              {time}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DatePicker = ({
  selectedMonth,
  setSelectedMonth,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}) => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [monthClickedRight, setMonthClickedRight] = useState(0);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const daysInMonth = new Date(
    new Date().getFullYear(),
    month + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(new Date().getFullYear(), month, 1).getDay();
  const todayDate = new Date().getDate();

  const selectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  useEffect(() => {
    setSelectedDate(null);
    setSelectedMonth(month);
  }, [month, setSelectedDate]);

  useEffect(() => {
    setSelectedDate(selectedDate);
  }, [selectedDate]);

  const checkValidDate = (day, todayDate) => {
    return new Date().getFullYear() === new Date().getFullYear() &&
      month === new Date().getMonth() &&
      day + 1 < todayDate
      ? 'disabled'
      : '';
  };

  return (
    <div className='picker'>
      <p className='select-date'>Select Date</p>
      <div className='date-picker'>
        <div className='month-selector'>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size='xl'
            onClick={() => {
              if (monthClickedRight > 0) {
                setMonthClickedRight(monthClickedRight - 1);
                setSelectedTime(null);
                setMonth((prevMonth) => (prevMonth + 11) % 12);
              }
            }}
            className={`navigation-arrow ${
              monthClickedRight === 0 ? 'disabled' : ''
            }`}
          />

          <span>{months[month]}</span>
          <FontAwesomeIcon
            icon={faChevronRight}
            size='xl'
            onClick={() => {
              setMonthClickedRight(monthClickedRight + 1);
              setSelectedTime(null);
              setMonth((prevMonth) => (prevMonth + 1) % 12);
            }}
            className='navigation-arrow'
          />
        </div>
        <div className='days-of-week'>
          {daysOfWeek.map((day, index) => (
            <div key={index} className='day-of-week'>
              {day}
            </div>
          ))}
        </div>
        <div className='dates'>
          {[...Array(firstDayOfMonth).keys()].map((day) => (
            <div key={day}></div>
          ))}
          {[...Array(daysInMonth).keys()].map((day) => (
            <div
              key={day}
              className={`date ${checkValidDate(day, todayDate)}`}
              onClick={() => selectDate(day + 1)}
            >
              <div
                className={` ${
                  selectedDate === day + 1 && selectedMonth === month
                    ? 'selected-date'
                    : ''
                }`}
              >
                {day + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DateTimePicker = ({
  selectedMonth,
  setSelectedMonth,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}) => {
  return (
    <div className='date-time-picker'>
      <DatePicker
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
      <TimePicker
        selectedMonth={selectedMonth}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
    </div>
  );
};

export default DateTimePicker;
