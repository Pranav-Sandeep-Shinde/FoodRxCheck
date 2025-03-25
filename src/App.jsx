import React from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router'
import Navbar from './components/SideBar';
import { Analytics } from "@vercel/analytics/react"
const App = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDrugs, setSelectedDrugs] = useState([]); // ✅ Add selectedDrugs state

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
      <main className='pt-4 md:pt-0'>
        {/* ✅ Pass selectedDrugs and setSelectedDrugs via context */}
        <Outlet context={{ selectedDrugs, setSelectedDrugs }} />
      </main>
      <SpeedInsights />
      <Analytics />
    </div>

  );
};

export default App
