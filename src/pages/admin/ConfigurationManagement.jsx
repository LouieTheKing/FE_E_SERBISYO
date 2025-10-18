import React, { useState, useEffect } from 'react';
import DataTable from '../../components/reusable/DataTable';
import Modal from '../../components/Modal/Modal';
import InputField from '../../components/reusable/InputField';
import Button from '../../components/reusable/Button';
import { FaEdit, FaTrash, FaPlus, FaCog } from 'react-icons/fa';
import { Settings } from 'lucide-react';
import { getConfigurations, createConfiguration, updateConfiguration, deleteConfiguration } from '../../api/configApi';
import { showCustomToast } from '../../components/Toast/CustomToast';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import configService from '../../utils/configService';

const ConfigurationManagement = () => {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    value: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch configurations
  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const response = await getConfigurations();
      setConfigurations(response.data || []);
    } catch (error) {
      showCustomToast(error.message || 'Failed to fetch configurations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.value.trim()) {
      newErrors.value = 'Value is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create configuration
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await createConfiguration(formData);
      
      // Clear configuration cache to force fresh fetch
      configService.clearCache();
      
      showCustomToast('Configuration created successfully', 'success');
      setShowCreateModal(false);
      setFormData({ name: '', value: '' });
      fetchConfigurations();
    } catch (error) {
      showCustomToast(error.message || 'Failed to create configuration', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit configuration
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await updateConfiguration(selectedConfig.id, formData);
      
      // Clear configuration cache to force fresh fetch
      configService.clearCache();
      
      showCustomToast('Configuration updated successfully', 'success');
      setShowEditModal(false);
      setFormData({ name: '', value: '' });
      setSelectedConfig(null);
      fetchConfigurations();
    } catch (error) {
      showCustomToast(error.message || 'Failed to update configuration', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete configuration
  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteConfiguration(selectedConfig.id);
      
      // Clear configuration cache to force fresh fetch
      configService.clearCache();
      
      showCustomToast('Configuration deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedConfig(null);
      fetchConfigurations();
    } catch (error) {
      showCustomToast(error.message || 'Failed to delete configuration', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (config) => {
    setSelectedConfig(config);
    setFormData({
      name: config.name,
      value: config.value
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (config) => {
    setSelectedConfig(config);
    setShowDeleteModal(true);
  };

  // Close modals and reset form
  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedConfig(null);
    setFormData({ name: '', value: '' });
    setErrors({});
  };

  // Table columns
  const columns = [
    {
      label: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900 capitalize">
          {value.replace(/_/g, ' ')}
        </span>
      )
    },
    {
      label: 'Value',
      accessor: 'value',
      sortable: true,
      type: 'auto', // This will auto-detect URLs and handle them appropriately
      maxLength: 50, // Customize truncation length for non-URL values
      // Remove the custom render function to let the DataTable handle URL detection
    },
    {
      label: 'Last Updated',
      accessor: 'updated_at',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              System Configuration
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage system settings and configurations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">

        <div className="p-6">
          <DataTable
            columns={columns}
            data={configurations}
            loading={loading}
            enableSearch={true}
            searchPlaceholder="Search configurations..."
            enablePagination={false}
            enableSelection={false}
            actions={[
              {
                icon: <FaEdit className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Edit',
                onClick: openEditModal,
              },
              {
                icon: <FaTrash className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Delete',
                onClick: openDeleteModal,
              }
            ]}
            actionButton={{
              label: "Add Configuration",
              icon: <FaPlus className="w-3.5 h-3.5" />,
              onClick: () => setShowCreateModal(true),
              className: "bg-red-900 text-white hover:bg-red-800"
            }}
          />
        </div>
      </div>

      {/* Create Configuration Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Add New Configuration"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <InputField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., app_name, email, phone"
            error={errors.name}
            required
          />
          <InputField
            label="Value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="Configuration value"
            error={errors.value}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModals}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="bg-red-900 hover:bg-red-800"
            >
              {isSubmitting ? 'Creating...' : 'Create Configuration'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Configuration Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeModals}
        title="Edit Configuration"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <InputField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Configuration name"
            error={errors.name}
            required
          />
          <InputField
            label="Value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="Configuration value"
            error={errors.value}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModals}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="bg-red-900 hover:bg-red-800"
            >
              {isSubmitting ? 'Updating...' : 'Update Configuration'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeModals}
        onConfirm={handleDelete}
        title="Delete Configuration"
        message={`Are you sure you want to delete the configuration "${selectedConfig?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={isSubmitting}
      />
    </div>
  );
};

export default ConfigurationManagement;