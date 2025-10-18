import React from 'react';

const ReviewSubmit = ({ form, handleProfilePictureChange, profilePreview }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Review & Submit</h3>
        <p className="text-gray-600 text-sm mt-2">Please review your information before submitting</p>
      </div>

      {/* Profile Picture Upload */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture (Optional)</h4>
          
          {profilePreview ? (
            <div className="mb-4">
              <img 
                src={profilePreview} 
                alt="Profile Preview" 
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
          />
          <label
            htmlFor="profile_picture"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md hover:scale-105 cursor-pointer transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {profilePreview ? 'Change Photo' : 'Upload Photo'}
          </label>
        </div>
      </div>
      
      {/* Review Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-6">Registration Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <ReviewItem label="Full Name" value={`${form.first_name || ''} ${form.middle_name || ''} ${form.last_name || ''} ${form.suffix || ''}`.trim()} />
            <ReviewItem label="Email" value={form.email} />
            <ReviewItem label="Birthday" value={form.birthday} />
            <ReviewItem label="Sex" value={form.sex === 'M' ? 'Male' : form.sex === 'F' ? 'Female' : ''} />
            <ReviewItem label="Civil Status" value={form.civil_status?.charAt(0).toUpperCase() + form.civil_status?.slice(1)} />
            <ReviewItem label="Contact" value={form.contact_no} />
          </div>
          
          <div className="space-y-3">
            <ReviewItem label="Nationality" value={form.nationality} />
            <ReviewItem label="Birth Place" value={form.birth_place} />

            {form.voters_id && <ReviewItem label="Voter's ID" value={form.voters_id} />}
            {form.is_pwd && <ReviewItem label="PWD ID" value={form.pwd_number} />}
            {form.is_single_parent && <ReviewItem label="Single Parent ID" value={form.single_parent_number} />}
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <ReviewItem 
              label="Complete Address" 
              value={`${form.house_no || ''} ${form.street || ''}, ${form.barangay || ''}, ${form.municipality || ''} ${form.zip_code || ''}`.trim()} 
            />
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-semibold text-blue-900">Account Creation Process</h3>
            <div className="mt-2 text-sm text-blue-800">
              <ul className="list-disc list-inside space-y-1">
                <li>Your registration will be submitted with "pending" status</li>
                <li>An administrator will review your application</li>
                <li>You'll receive an email notification once approved</li>
                <li>Login credentials will be provided after approval</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewItem = ({ label, value }) => (
  <div>
    <span className="font-semibold text-gray-600">{label}:</span>
    <p className="text-gray-900">{value}</p>
  </div>
);

export default ReviewSubmit;
