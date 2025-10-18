import React from 'react';
import { FaUser } from 'react-icons/fa';

const ProfilePictureUpload = ({ previewUrl, handleFileChange, errors }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4 border-4 border-gray-200">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Profile Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <FaUser className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <label
            htmlFor="profile_picture"
            className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 hover:shadow-md hover:scale-105 transition-all duration-200"
          >
            Upload Photo
          </label>
          {errors?.profile_picture && (
            <p className="mt-2 text-sm text-red-500">{errors.profile_picture}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
