import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import barangayBg from "../../assets/background/santol_hall.jpg";
import santolLogo from '../../assets/logo/santol_logo.png';
import { useConfig } from '../../hooks/useConfig'

const HeroSection = () => {
  const location = useLocation();
  const appName = useConfig('app_name')
  const barangay = useConfig('barangay')
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center py-16 xs:py-20 sm:py-24"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${barangayBg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <img 
            src={santolLogo} 
            alt="Barangay Santol Logo" 
            className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-white/90 border-2 border-white shadow-lg mb-6 sm:mb-8" 
          />

          <h2 className="text-white/90 text-base xs:text-lg sm:text-xl font-medium tracking-wide mb-3 sm:mb-4">
            Barangay {barangay}
          </h2>

          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            {appName}
          </h1>

          <div className="w-12 sm:w-16 h-1 bg-red-800 mx-auto mb-6 sm:mb-8" />

          <p className="text-base xs:text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
            Your digital gateway to efficient and accessible barangay services.
            Experience seamless document requests and tracking anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link
              to="/login"
              className="px-6 sm:px-8 py-3 bg-red-800 hover:bg-red-700 text-white rounded-lg shadow-lg transition-colors duration-300 text-base sm:text-lg"
            >
              Access Services
            </Link>
            <Link
              to="/track-document"
              className="px-6 sm:px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 text-base sm:text-lg"
            >
              Track Document
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
