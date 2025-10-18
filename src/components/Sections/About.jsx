import React from "react";
import { FiBook } from "react-icons/fi";
import { useConfig } from '../../hooks/useConfig';

function AboutSection() {
  const appName = useConfig('app_name')

  return (
    <section className="w-full py-10 sm:py-16 bg-[var(--color-white)] flex flex-col items-center px-2 sm:px-4">
      <div className="w-16 h-1.5 bg-[var(--color-secondary)] rounded-full mb-6 sm:mb-8" />
      <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6"><FiBook className="text-[var(--color-secondary)] text-2xl" /> About {appName}</h2>
      <p className="max-w-2xl text-neutral-800 text-center text-xs sm:text-lg">
        {appName} is a digital platform that streamlines barangay document requests and releases. Residents can request documents online, while staff manage and process these requests at the barangay hall. Every action is recorded for full transparency and accountability.
      </p>
  </section>
  )
};

export default AboutSection;
