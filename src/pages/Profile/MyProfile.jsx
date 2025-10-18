import React, { useState, useEffect, useRef } from 'react';
import Banner from '../../assets/background/santol_hall.jpg';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import PersonalInformation from '../../components/Profile/PersonalInformation';
import AddressInformation from '../../components/Profile/AddressInformation';
import EditProfileModal from '../../components/Profile/EditProfileModal';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { updatePassword } from '../../api/accountApi';
import ChangePasswordModal from '../../components/modals/ChangePasswordModal';

const MyProfile = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditForm({ ...currentUser });
    }
  }, [currentUser]);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to log profile update:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordUpdate = async (passwordData) => {
    try {
      setIsPasswordLoading(true);
      await updatePassword(currentUser.id, passwordData);
      toast.success('Password updated successfully');
      setIsPasswordModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile information...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No profile information available.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 transition-all duration-300 ease-in-out">
      {/* Banner Section */}
      <div className="relative h-64 -mt-8">
        <img src={Banner} alt="Barangay Hall" className="w-full h-full object-cover brightness-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      </div>

      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ProfileHeader 
            profile={currentUser}
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
            fileInputRef={fileInputRef}
            onEdit={() => setIsEditModalOpen(true)}
          />
          
          <div className="space-y-6">
            <PersonalInformation 
              profile={currentUser}
              onEdit={() => setIsEditModalOpen(true)}
            />

            <AddressInformation 
              profile={currentUser}
              onEdit={() => setIsEditModalOpen(true)}
            />

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Security</h2>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Change Password
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Manage your password and account security settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleProfileUpdate}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordUpdate}
        isLoading={isPasswordLoading}
      />
    </div>
  );
};

export default MyProfile;