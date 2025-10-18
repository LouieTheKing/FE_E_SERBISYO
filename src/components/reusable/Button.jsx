import React from "react";

const Button = ({
  type = "button",
  loading = false,
  disabled = false,
  children,
  className = "",
  loadingText = "Please wait...",
  ...props
}) => ( 
  <button
    type={type}
    className={`px-2 py-3 cursor-pointer bg-[var(--color-secondary)] text-[var(--color-white)] rounded-xl font-bold shadow-lg hover:bg-[var(--color-primary)] hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-200 text-lg focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)] mt-2 ${
      disabled || loading 
        ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-lg' 
        : ''
    } ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? loadingText : children}
  </button>
);

export default Button;
