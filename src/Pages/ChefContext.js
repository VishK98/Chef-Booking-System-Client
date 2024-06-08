import React, { createContext, useContext, useState } from 'react';

const ChefContext = createContext();

export const ChefProvider = ({ children }) => {
  const [chefId, setChefId] = useState(null);

  const setBookingChefId = (id) => {
    setChefId(id);
  };

  return (
    <ChefContext.Provider value={{ chefId, setBookingChefId }}>
      {children}
    </ChefContext.Provider>
  );
};

export const useChefContext = () => useContext(ChefContext);
