import React, { useRef, useState } from 'react';
import './App.css';
import { SAMPLE_DATA } from './data'; // Add the missing import statement for SAMPLE_DATA

const ITEM_WIDTH = 200;

function test() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const containerRef = useRef();

  // Function to handle scrolling when the button is clicked
  const handleScroll = (scrollAmount) => {
    // Calculate the new scroll position
    const newScrollPosition = scrollPosition + scrollAmount;

    // Update the state with the new scroll position
    setScrollPosition(newScrollPosition);

    // Access the container element and set its scrollLeft property
    containerRef.current.scrollLeft = newScrollPosition;
  };

  return (
    <div className='container'>
      <div
        ref={containerRef}
        style={{
          width: '900px',
          overflowX: 'scroll',
          scrollBehavior: 'smooth',
        }}
      >
        <div className='content-box'>
          {SAMPLE_DATA.map((item) => (
            <div className='card' style={{ backgroundColor: item.color }}>
              <p>{item.id}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='action-btns'>
        <button onClick={() => handleScroll(-ITEM_WIDTH)}>Scroll Left</button>
        <button onClick={() => handleScroll(ITEM_WIDTH)}>Scroll Right</button>
      </div>
    </div>
  );
}

export default test;
