import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  modalClass = "max-w-3xl",
}) => {
  useEffect(() => {
    if (isOpen) {
      // Lock scroll when modal opens
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll when modal closes
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`relative w-full ${modalClass} my-2 mx-auto bg-white rounded-xl shadow-2xl transform transition-all`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all duration-200 cursor-pointer"
                aria-label="Close modal"
              >
                <IoClose className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
