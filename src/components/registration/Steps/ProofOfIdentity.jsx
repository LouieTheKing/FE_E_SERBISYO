import React from 'react';

const ProofOfIdentity = ({ handleFileChange, previews, stepErrors }) => {
  const renderUploadSection = (id, title, preview, description = '') => (
    <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white">
      <h4 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-4">{title}</h4>
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      <div className="flex flex-col items-center">
        {preview ? (
          <div className="mb-4 w-full">
            <div className="relative w-full max-w-sm mx-auto">
              <img 
                src={preview} 
                alt={title} 
                className="w-full h-auto object-contain rounded-lg shadow-lg"
                style={{ maxHeight: '200px' }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-32 sm:h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )}
        <input
          type="file"
          id={id}
          name={id} // Add name attribute to match API field names
          accept="image/*"
          onChange={(e) => handleFileChange(e, id)}
          className="hidden"
        />
        <label
          htmlFor={id}
          className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-red-900 text-white text-sm rounded-lg cursor-pointer hover:bg-red-800 hover:shadow-md hover:scale-105 transition-all duration-200"
        >
          {preview ? 'Change Photo' : `Upload ${title}`}
        </label>
        {stepErrors && stepErrors[id] && (
          <p className="mt-2 text-xs sm:text-sm text-red-600">{stepErrors[id]}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Proof of Identity</h3>
        <p className="text-gray-600 text-xs sm:text-sm mt-2">Please provide clear photos of your valid ID and a selfie</p>
      </div>

      <div className="space-y-4 sm:space-y-8">
        {renderUploadSection('front_id_card', 'Valid ID (Front)', previews.idFront)}
        {renderUploadSection('back_id_card', 'Valid ID (Back)', previews.idBack)}
        {renderUploadSection(
          'selfie_id_card', 
          'Selfie with ID', 
          previews.selfieWithId,
          'Take a clear photo of yourself holding your ID next to your face'
        )}
      </div>
    </div>
  );
};

export default ProofOfIdentity;
