import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { showCustomToast } from '../../../components/Toast/CustomToast';
import validators from '../../../utils/validations';
import ProfilePictureUpload from '../../../components/resident/ProfilePictureUpload';
import AccountInformationSection from '../../../components/resident/AccountInformationSection';
import PersonalInformationSection from '../../../components/resident/PersonalInformationSection';
import ContactAndAddressSection from '../../../components/resident/ContactAndAddressSection';
import AdditionalInformationSection from '../../../components/resident/AdditionalInformationSection';
import { createAccount } from '../../../api/accountApi';

const AddResident = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    sex: '',
    civil_status: '',
    birthday: '',
    contact_no: '',
    birth_place: '',
    municipality: 'Balagtas', 
    barangay: 'Pulong Gubat',
    house_no: '',
    zip_code: '3014',
    street: '',
    type: 'residence',
    pwd_number: '',
    single_parent_number: '',
    profile_picture: null,
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  // Styling classes
  const styleClasses = {
    input: "w-full px-3 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition duration-200",
    inputWithIcon: "pl-9 w-full px-3 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition duration-200",
    label: "block text-sm font-medium text-gray-700 mb-1",
    icon: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",
    section: "bg-gray-50 p-6 rounded-md border border-gray-200"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profile_picture: 'File size must be less than 5MB'
        }));
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profile_picture: 'Only JPG, PNG, and GIF files are allowed'
        }));
        return;
      }

      setFormData(prev => ({ ...prev, profile_picture: file }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Custom phone number validation for exactly 11 digits
  const validatePhoneNumber = (phone) => {
    if (!phone) return 'Phone number is required';
    if (!/^09\d{9}$/.test(phone)) {
      return 'Phone number must start with 09 and be exactly 11 digits';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields with proper validation rules
    const emailError = validators.validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const firstNameError = validators.validateName(formData.first_name, 'First name');
    if (firstNameError) newErrors.first_name = firstNameError;

    const lastNameError = validators.validateName(formData.last_name, 'Last name');
    if (lastNameError) newErrors.last_name = lastNameError;

    const middleNameError = validators.validateMiddleName(formData.middle_name);
    if (middleNameError) newErrors.middle_name = middleNameError;

    const suffixError = validators.validateSuffix(formData.suffix);
    if (suffixError) newErrors.suffix = suffixError;

    const sexError = validators.validateSex(formData.sex);
    if (sexError) newErrors.sex = sexError;

    // Civil status validation
    if (!formData.civil_status) {
      newErrors.civil_status = 'Civil status is required';
    }

    const birthdayError = validators.validateBirthday(formData.birthday);
    if (birthdayError) newErrors.birthday = birthdayError;

    const phoneError = validatePhoneNumber(formData.contact_no);
    if (phoneError) newErrors.contact_no = phoneError;

    const birthPlaceError = validators.validateBirthPlace(formData.birth_place);
    if (birthPlaceError) newErrors.birth_place = birthPlaceError;

    const houseNumberError = validators.validateHouseNumber(formData.house_no);
    if (houseNumberError) newErrors.house_no = houseNumberError;

    const streetError = validators.validateStreet(formData.street);
    if (streetError) newErrors.street = streetError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Create FormData object
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (key === 'profile_picture' && formData[key]) {
            formDataToSend.append(key, formData[key]);
          } else if (formData[key] !== null && formData[key] !== undefined) {
            formDataToSend.append(key, formData[key]);
          }
        });

        // Force type to be 'residence'
        formDataToSend.set('type', 'residence');
        
        // Make API call
        const response = await createAccount(formDataToSend);
        
        showCustomToast('Resident registered successfully!', 'success');

        // Reset form
        setFormData({
          email: '',
          first_name: '',
          middle_name: '',
          last_name: '',
          suffix: '',
          sex: '',
          civil_status: '',
          birthday: '',
          contact_no: '',
          birth_place: '',
          municipality: 'San Jose del Monte', // Reset municipality to default
          barangay: 'Pulong Gubat',
          house_no: '',
          zip_code: '3014',
          street: '',
          type: 'residence',
          pwd_number: '',
          single_parent_number: '',
          profile_picture: null,
          status: 'active'
        });
        setPreviewUrl(null);
        
      } catch (error) {
        showCustomToast(error.message || 'Failed to register resident', 'error');
        console.error('Error submitting form:', error);
      }
    } else {
      showCustomToast('Please check all required fields', 'error');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add New Resident</h1>
        <p className="mt-1 text-sm text-gray-600">Fill in the information below to register a new resident account.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaUser className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Resident Information</h2>
              <p className="text-sm text-gray-500">All fields marked with an asterisk (*) are required</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <ProfilePictureUpload 
            previewUrl={previewUrl}
            handleFileChange={handleFileChange}
            errors={errors}
          />

          <div className="space-y-6">
            <AccountInformationSection 
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              inputClasses={styleClasses.inputWithIcon}
              labelClasses={styleClasses.label}
              iconClasses={styleClasses.icon}
            />

            <PersonalInformationSection
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              styleClasses={styleClasses}
            />

            <ContactAndAddressSection
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              styleClasses={styleClasses}
              disableMunicipality={true} // Add this prop to make municipality read-only
            />

            <AdditionalInformationSection
              formData={formData}
              handleChange={handleChange}
              styleClasses={styleClasses}
            />
          </div>

          <div className="mt-4 flex justify-end border-t pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Register Resident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResident;