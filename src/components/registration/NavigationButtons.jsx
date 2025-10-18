import React from 'react';

const NavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  prevStep, 
  nextStep, 
  handleSubmit, 
  isLoading, 
  isValid 
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={prevStep}
        disabled={currentStep === 1}
        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
          currentStep === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      {currentStep === totalSteps ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 text-white cursor-pointer ${
            isValid && !isLoading
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed opacity-75'
          }`}
        >
          {isLoading ? 'Submitting...' : 'Submit Registration'}
        </button>
      ) : (
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
