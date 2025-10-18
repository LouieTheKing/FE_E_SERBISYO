import React from "react";
import { Link } from "react-router-dom";

const HeroButton = ({ to, children }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3.5 bg-[var(--color-secondary)] text-[var(--color-accent)] rounded-lg shadow hover:bg-[var(--color-secondary)] hover:text-[var(--color-bg)] hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] border border-[var(--color-secondary)] whitespace-nowrap cursor-pointer"
  >
    {children}
  </Link>
);

export default HeroButton;
