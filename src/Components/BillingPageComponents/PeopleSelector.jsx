import React from 'react';
import './PeopleSelector.css';

const AdultsSelector = ({ numberOfAdults, setNumberOfAdults }) => {
  const decreaseAdults = () => {
    if (numberOfAdults > 0) {
      setNumberOfAdults(numberOfAdults - 1);
    }
  };
  const increaseAdults = () => {
    setNumberOfAdults(numberOfAdults + 1);
  };
  return (
    <div>
      <p className='number-of-people'>Number of adults</p>

      <div className='people-selector'>
        <button className='adjust-button' onClick={decreaseAdults}>
          -
        </button>
        <div className='people-count'>{numberOfAdults}</div>
        <button className='adjust-button' onClick={increaseAdults}>
          +
        </button>
      </div>
    </div>
  );
};

const KidsSelector = ({ numberOfKids, setNumberOfKids }) => {
  const decreaseKids = () => {
    if (numberOfKids > 0) {
      setNumberOfKids(numberOfKids - 1);
    }
  };
  const increaseKids = () => {
    setNumberOfKids(numberOfKids + 1);
  };
  return (
    <div>
      <p className='number-of-people'>Number of kids</p>

      <div className='people-selector'>
        <button className='adjust-button' onClick={decreaseKids}>
          -
        </button>
        <div className='people-count'>{numberOfKids}</div>
        <button className='adjust-button' onClick={increaseKids}>
          +
        </button>
      </div>
    </div>
  );
};

const PeopleSelector = ({
  numberOfAdults,
  setNumberOfAdults,
  numberOfKids,
  setNumberOfKids,
}) => {
  return (
    <div className='people-container'>
      <AdultsSelector
        numberOfAdults={numberOfAdults}
        setNumberOfAdults={setNumberOfAdults}
      />
      <KidsSelector
        numberOfKids={numberOfKids}
        setNumberOfKids={setNumberOfKids}
      />
    </div>
  );
};

export default PeopleSelector;
