import { useState, useEffect } from "react";
import Hero from "../components/HomeCustom/Hero";
import logoAnimation from "../assets/logoAnimation.mp4";

const Home = () => {
  const [showHero, setShowHero] = useState(false);

  const [playAnimation, setPlayAnimation] = useState(true);

  useEffect(() => {
    // Check if the animation has already been played
    const hasPlayedAnimation = sessionStorage.getItem("logoAnimationPlayed");

    if (hasPlayedAnimation) {
      setShowHero(true);
      setPlayAnimation(false); // Skip animation
    }
  }, []);

  const handleLogoAnimationEnd = () => {

    setTimeout(() => {
      setShowHero(true);
      sessionStorage.setItem("logoAnimationPlayed", "true"); // Mark as played
    }, 500);
  };

  return (
    <div className="main">
      {playAnimation && !showHero && (
        <video
          className={`video`}
          src={logoAnimation}
          autoPlay
          muted
          onEnded={handleLogoAnimationEnd}
        />
      )}
      {showHero && (
        <>
          <Hero showHero={showHero} />
        </>
      )}
    </div>
  );
};

export default Home;
