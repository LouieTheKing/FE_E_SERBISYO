import React from "react";

const FormInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>}
    {props.type === "select" ? (
      <select {...props} className="py-3 px-5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] hover:border-gray-400 outline-none text-sm bg-white transition-all duration-200 cursor-pointer" >
        {props.children}
      </select>
    ) : (
      <input {...props} className="py-3 px-5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] hover:border-gray-400 outline-none text-sm bg-white transition-all duration-200" />
    )}
  </div>
);

export default FormInput;
