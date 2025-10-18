import React from 'react';

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  icon: Icon,
  error,
  placeholder,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`w-4 h-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`
            block w-full px-3 py-2 text-sm 
            ${Icon ? 'pl-10' : ''}
            border ${error ? 'border-red-300' : 'border-gray-300'}
            rounded-lg
            focus:outline-none
            focus:ring-2
            ${error 
              ? 'focus:ring-red-500 focus:border-red-500' 
              : 'focus:ring-red-500 focus:border-red-500'
            }
            hover:border-gray-400
            disabled:bg-gray-50
            disabled:text-gray-500
            disabled:cursor-not-allowed
            transition-all duration-200
            ${className}
          `}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default InputField;