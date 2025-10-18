import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import logo from '../assets/logo/santol_logo.png';
import { useConfig } from '../hooks/useConfig';

const Footer = () => {
  const phone = useConfig('phone');
  const email = useConfig('email');
  const address = useConfig('address');
  const exactAddress = useConfig('exact_address');
  const appName = useConfig('app_name')
  const fbLink = useConfig('fb_link')

  return (
  <footer className="w-full bg-red-800 text-white py-10 px-4 flex flex-col items-center justify-center mt-auto max-w-full overflow-x-visible border-t border-red-900">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl mb-6 text-left text-xs sm:text-sm">
      {/* Brand */}
      <div className="flex flex-col items-center sm:items-start gap-2">
        <img src={logo} alt="Barangay Santol Logo" className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover bg-white/80 border border-white shadow mb-1" />
        <span className="font-extrabold text-xl sm:text-2xl text-white tracking-wide">{appName}</span>
        <span className="flex items-center gap-2 text-xs sm:text-sm text-white/90"><FiMapPin className="inline-block" /> {exactAddress}</span>
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-xs sm:text-sm font-medium items-center sm:items-start">
        <Link to="/" className="hover:text-white text-white/90 transition-all duration-200 cursor-pointer hover:translate-x-1">Home</Link>
        <Link to="/register" className="hover:text-white text-white/90 transition-all duration-200 cursor-pointer hover:translate-x-1">Register</Link>
        <Link to="/login" className="hover:text-white text-white/90 transition-all duration-200 cursor-pointer hover:translate-x-1">Login</Link>
      </nav>
      {/* Social & Contact */}
      <div className="flex flex-col gap-2 items-center sm:items-start">
        <a href={fbLink} target="_blank" rel="noopener noreferrer" 
           className="flex items-center gap-2 hover:text-white text-white/90 transition-all duration-200 text-xs sm:text-sm cursor-pointer hover:translate-x-1 hover:scale-105">
          <FiFacebook /> Facebook
        </a>
        <a href={`mailto:${email}`} 
           className="flex items-center gap-2 hover:text-white text-white/90 transition-all duration-200 text-xs sm:text-sm cursor-pointer hover:translate-x-1 hover:scale-105">
          <FiMail /> {email}
        </a>
        <span className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
          <FiPhone /> {phone}
        </span>
      </div>
    </div>
    
    <div className="w-full h-px bg-red-900/50 mb-4" />
    <div className="text-xs sm:text-sm text-center text-white/90">
      &copy; 2025 Barangay Management System. All rights reserved.
    </div>
  </footer>
  );
};

export default Footer;
