import { React, useState } from 'react';
import './ProfileRightComponent.css';
import { Link } from 'react-router-dom';
import BookedSessionCards from './BookedSessionCards';
import SavedAddressComponent from './SavedAddressComponent';
import ProfilePaymentMethod from './ProfilePaymentMethod';

const ProfileRightComponent = ({
  bookings,
  name,
  address,
  isLoggedIn,
  setIsLoggedIn,
  loggedInUserName,
  setLoggedInUserName,
}) => {
  const [selectedLink, setSelectedLink] = useState(1);

  const handleLinkClick = (button) => {
    setSelectedLink(button);
  };

  return (
    <div className='booking-session-container'>
      <div className='booking-session-pills'>
        <Link
          to={``}
          id={selectedLink === 1 ? 'selected' : ''}
          onClick={() => handleLinkClick(1)}
        >
          Upcoming Sessions
        </Link>
        <Link
          to={``}
          id={selectedLink === 2 ? 'selected' : ''}
          onClick={() => handleLinkClick(2)}
        >
          Saved Addresses
        </Link>
        <Link
          to={``}
          id={selectedLink === 3 ? 'selected' : ''}
          onClick={() => handleLinkClick(3)}
        >
          Saved Payment Methods
        </Link>
      </div>
      <div className='booking-session-menu-container'>
        {selectedLink === 1 ? (
          <BookedSessionCards
            bookings={bookings}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            loggedInUserName={loggedInUserName}
            setLoggedInUserName={setLoggedInUserName}
          />
        ) : selectedLink === 2 ? (
          <SavedAddressComponent name={name} address={address} />
        ) : (
          <ProfilePaymentMethod />
        )}
      </div>
    </div>
  );
};

export default ProfileRightComponent;
