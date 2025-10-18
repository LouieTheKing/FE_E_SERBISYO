import React from 'react';
import { FaVenusMars, FaBirthdayCake, FaHeart } from 'react-icons/fa';

const PersonalInformationSection = ({ formData, handleChange, errors, styleClasses }) => {
  const civilStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'separated', label: 'Separated' }
  ];

  return (
    <section className={styleClasses.section}>
      <h2 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="first_name" className={styleClasses.label}>First Name *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={styleClasses.input}
            />
            {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
          </div>

          <div>
            <label htmlFor="middle_name" className={styleClasses.label}>Middle Name</label>
            <input
              type="text"
              id="middle_name"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className={styleClasses.input}
            />
            {errors.middle_name && <p className="mt-1 text-sm text-red-500">{errors.middle_name}</p>}
          </div>

          <div>
            <label htmlFor="last_name" className={styleClasses.label}>Last Name *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={styleClasses.input}
            />
            {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
          </div>

          <div>
            <label htmlFor="suffix" className={styleClasses.label}>Suffix</label>
            <input
              type="text"
              id="suffix"
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              className={styleClasses.input}
              placeholder="Jr., Sr., III"
            />
            {errors.suffix && <p className="mt-1 text-sm text-red-500">{errors.suffix}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sex" className={styleClasses.label}>Sex *</label>
            <div className="relative">
              <FaVenusMars className={styleClasses.icon} />
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className={styleClasses.inputWithIcon}
              >
                <option value="">Select Sex</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            {errors.sex && <p className="mt-1 text-sm text-red-500">{errors.sex}</p>}
          </div>

          <div>
            <label htmlFor="civil_status" className={styleClasses.label}>Civil Status *</label>
            <div className="relative">
              <FaHeart className={styleClasses.icon} />
              <select
                id="civil_status"
                name="civil_status"
                value={formData.civil_status}
                onChange={handleChange}
                className={styleClasses.inputWithIcon}
              >
                <option value="">Select Civil Status</option>
                {civilStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.civil_status && <p className="mt-1 text-sm text-red-500">{errors.civil_status}</p>}
          </div>

          <div>
            <label htmlFor="birthday" className={styleClasses.label}>Birthday *</label>
            <div className="relative">
              <FaBirthdayCake className={styleClasses.icon} />
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className={styleClasses.inputWithIcon}
              />
            </div>
            {errors.birthday && <p className="mt-1 text-sm text-red-500">{errors.birthday}</p>}
          </div>

          <div>
            <label htmlFor="birth_place" className={styleClasses.label}>Birth Place *</label>
            <input
              type="text"
              id="birth_place"
              name="birth_place"
              value={formData.birth_place}
              onChange={handleChange}
              className={styleClasses.input}
            />
            {errors.birth_place && <p className="mt-1 text-sm text-red-500">{errors.birth_place}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalInformationSection;
