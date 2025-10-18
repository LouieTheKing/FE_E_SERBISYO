import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Register from "../components/Register"; 
import logo from '../assets/logo/santol_logo.png';
import CustomToastContainer, { showCustomToast } from "../components/Toast/CustomToast";
import { register } from "../api/registerApi";
import { validateForm } from "../utils/validations";

const initialState = {
  email: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  sex: "",
  nationality: "Filipino",
  birthday: "",
  contact_no: "",
  birth_place: "",
  municipality: "Balagtas", // Fixed value
  barangay: "Santol", // Fixed value
  house_no: "",
  zip_code: "3016", // Fixed value
  street: "",
  password: "",
  password_confirmation: "",
  type: "residence",
  pwd_number: "",
  single_parent_number: "",
  profile_picture: null,
  status: "pending",
  id_front: null,
  id_back: null,
  selfie_with_id: null,
  civil_status: "",
};

const RegisterPage = () => {
  const [form, setForm] = useState(initialState);
  const [success, setSuccess] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSignal, setResetSignal] = useState(0); // Add reset signal
  const navigate = useNavigate();

  const handleChange = (e) => {
    let updatedForm;
    
    if (e.target.type === "file") {
      const file = e.target.files[0];
      // Validate file type before setting
      if (
        file &&
        !["image/jpeg", "image/jpg", "image/png"].includes(file.type)
      ) {
        setErrors({
          ...errors,
          [e.target.name]: [
            `The ${e.target.name.replace('_', ' ')} field must be an image (jpeg, jpg, png).`
          ],
        });
        updatedForm = { ...form, [e.target.name]: null };
      } else {
        setErrors((prev) => {
          const { [e.target.name]: removed, ...rest } = prev;
          return rest;
        });
        updatedForm = { ...form, [e.target.name]: file };
      }
    } else if (e.target.type === "checkbox") {
      updatedForm = { ...form, [e.target.name]: e.target.checked };
    } else {
      updatedForm = { ...form, [e.target.name]: e.target.value };
    }

    // Update form state
    setForm(updatedForm);

    // Validate the changed field
    const fieldName = e.target.name;
    if (fieldName && fieldName !== 'profile_picture') {
      const fieldValidation = validateForm({ [fieldName]: updatedForm[fieldName] });
      if (!fieldValidation.isValid) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: [fieldValidation.errors[fieldName]]
        }));
      } else {
        setErrors(prev => {
          const { [fieldName]: removed, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form before submission
    const validation = validateForm(form);
    if (!validation.isValid) {

      const formattedErrors = {};
      Object.entries(validation.errors).forEach(([field, message]) => {
        formattedErrors[field] = [message];
      });
      setErrors(formattedErrors);
      showCustomToast("Please fix the form errors before submitting.", "error");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const res = await register(formData);
      setSuccess(res);
      showCustomToast("Registration successful! Redirecting to login...", "success");
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000); // 2 second delay to show the success message
      
    } catch (err) {
      setErrors(err);
      // Show first error message in toast
      const firstError = Object.values(err)[0]?.[0] || "Registration failed. Please check the form.";
      showCustomToast(firstError, "error");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(30,30,30,0.5),rgba(30,30,30,0.5)), url('/src/assets/background/santol_hall.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <CustomToastContainer />
        <Navbar navOpen={navOpen} setNavOpen={setNavOpen} logo={logo} />
        
        {/* Adjust padding and max-width for better responsiveness */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="max-w-4xl mx-auto mt-16 mb-8">
            <div className="bg-white/95 rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 border border-[var(--color-accent)]">
              <span className="block text-center text-[var(--color-primary)] mb-8 font-bold text-2xl tracking-wide">
                Resident Registration
              </span>

              <div className="w-full max-w-3xl mx-auto">
                <Register 
                  form={form} 
                  handleChange={handleChange} 
                  handleSubmit={handleSubmit}
                  resetSignal={resetSignal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;