import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import ConfirmationModal from './ConfirmationModal';
import InputField from '../reusable/InputField';
import { FileText, ListChecks } from 'lucide-react';
import { createDocument, uploadDocumentTemplate } from '../../api/documentApi';
import { showCustomToast } from '../Toast/CustomToast';
import { FaCloudUploadAlt } from 'react-icons/fa';

const CreateCertificateModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    document_name: '',
    description: '',
    template: null 
  });
  const [errors, setErrors] = useState({});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        showCustomToast('Please upload PDF or DOCX files only', 'error');
        return;
      }
      setFormData(prev => ({ ...prev, template: file }));
      setHasChanges(true);
    }
  };

  const resetForm = () => {
    setFormData({
      document_name: '',
      description: '',
      template: null
    });
    setErrors({});
    setHasChanges(false);
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.document_name) newErrors.document_name = 'Document name is required';
    if (!formData.description) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showCustomToast('Please fill in all required fields', 'error');
      return;
    }

    setShowConfirmSubmit(true);
  };

  const confirmSubmit = async () => {
    try {
      const response = await createDocument({
        document_name: formData.document_name,
        description: formData.description,
        status: 'active'
      });

      if (formData.template && response.document?.id) {
        try {
          await uploadDocumentTemplate(response.document.id, formData.template);
        } catch (templateError) {
          showCustomToast(templateError?.message || 'Template upload failed', 'warning');
          resetForm();
          if (onSuccess) onSuccess(response.document);
          onClose();
          return;
        }
      }

      showCustomToast(response.message || 'Document created successfully', 'success');
      resetForm();
      if (onSuccess) onSuccess(response.document);
      onClose();
    } catch (error) {
      // Display exact error message from API
      if (typeof error === 'object' && error !== null) {
        if (error.document_name) {
          // Handle validation errors for document_name
          showCustomToast(error.document_name[0], 'error');
        } else if (error.message) {
          // Handle general error message
          showCustomToast(error.message, 'error');
        } else {
          // Handle unknown error format
          showCustomToast('Failed to create document', 'error');
        }
      } else {
        showCustomToast(error || 'Failed to create document', 'error');
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Add New Document"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-red-900 border border-transparent rounded-md hover:bg-red-800"
            >
              Add Document
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6">
          <InputField
            label="Document Name"
            name="document_name"
            value={formData.document_name}
            onChange={handleChange}
            placeholder="e.g., Barangay Clearance"
            error={errors.document_name}
            icon={<FileText className="w-4 h-4" />}
            required
          />

          <InputField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter document description"
            error={errors.description}
            icon={<ListChecks className="w-4 h-4" />}
            required
            multiline
            rows={3}
          />

          {/* Template Upload Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Template
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="template"
                onChange={handleTemplateUpload}
                className="hidden"
                accept=".pdf,.docx"
              />
              <label
                htmlFor="template"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:shadow-sm hover:scale-105 border border-gray-300 transition-all duration-200"
              >
                <FaCloudUploadAlt className="w-4 h-4" />
                {formData.template ? 'Change Template' : 'Upload Template'}
              </label>
              {formData.template && (
                <span className="text-sm text-green-600">
                  ✓ {formData.template.name}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Upload a PDF or DOCX file as your document template
            </p>
          </div>
        </div>
      </Modal>

      {/* Confirm Submit Modal */}
      <ConfirmationModal
        isOpen={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
        onConfirm={confirmSubmit}
        title="Create Document"
        message="Are you sure you want to create this document?"
        confirmText="Create"
        cancelText="Cancel"
      />

      {/* Discard Changes Modal */}
      <ConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          resetForm();
          onClose();
        }}
        title="Discard Changes"
        message="Are you sure you want to discard your changes?"
        confirmText="Discard"
        cancelText="Keep Editing"
        type="warning"
      />
    </>
  );
};

export default CreateCertificateModal;
