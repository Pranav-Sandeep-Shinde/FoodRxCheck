import React from 'react'
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router'
import Navbar from './components/SideBar';
const App = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isAnimationDisplayed = sessionStorage.getItem("logoAnimationPlayed");

    if (isAnimationDisplayed === "true") {
      setIsVisible(true); // Show immediately if already played
      return;
    }

    // Delay only on the first session
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem("logoAnimationPlayed", "true"); // Store flag
    }, 5000);

    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
  }, []);
  return (
    <div className='min-h-screen bg-gray-100'>
      {isVisible && <Navbar />} {/* Show navbar after 5 sec delay */}
      <main className='pt-16 md:pt-0'>
        <Outlet />
      </main>

    </div>

  );
};

export default App