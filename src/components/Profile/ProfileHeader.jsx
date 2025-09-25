import React from 'react';
import { FaCamera } from 'react-icons/fa';

const ProfileHeader = ({ profile, imagePreview, handleImageChange, fileInputRef }) => {
  // Get initials from name
  const getInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex flex-col items-center -mt-16 mb-8 relative z-10">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 ring-4 ring-white shadow-lg">
          {imagePreview ? (
            <img 
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : profile?.profile_picture ? (
            <img 
              src={profile.profile_picture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-red-900 text-white text-3xl font-semibold">
              {getInitials()}
            </div>
          )}
        </div>
        <button 
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 w-8 h-8 bg-red-800 rounded-full border-2 border-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-md"
        >
          <FaCamera className="w-4 h-4 text-white" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {`${profile?.first_name || ''} ${profile?.last_name || ''}`}
        </h2>
      </div>
    </div>
  );
};

export default ProfileHeader;

