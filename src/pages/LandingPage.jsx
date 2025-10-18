import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/Sections/Hero";
import AnnouncementsSection from "../components/Sections/Announcements";
import FeaturesSection from "../components/Sections/Features";
import AboutSection from "../components/Sections/About";
import HowItWorksSection from "../components/Sections/HowItWorks";
import ContactSection from "../components/Sections/Contact";
import Footer from "../components/Footer";
import logo from '../assets/logo/santol_logo.png';

const LandingPage = () => {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="min-h-screen h-full flex flex-col relative overflow-x-hidden w-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      <Navbar 
        navOpen={navOpen} 
        setNavOpen={setNavOpen}
        logo={logo}
      />
      <HeroSection />
      <AnnouncementsSection />
      <FeaturesSection />
      <AboutSection />
      <HowItWorksSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
 
 