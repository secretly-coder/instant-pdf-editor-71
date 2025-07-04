
import React from 'react';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              We respect your privacy. All files you upload are processed securely and are not stored longer than necessary to complete your tasks.
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Collection</h3>
              <p className="text-gray-700 mb-4">
                We only collect files that you voluntarily upload to our service for processing. We do not collect personal information unless you provide it voluntarily.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Processing</h3>
              <p className="text-gray-700 mb-4">
                Your uploaded files are processed locally in your browser when possible, or on our secure servers for complex operations. Files are automatically deleted after processing is complete.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Security</h3>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your files during processing. All communications are encrypted using industry-standard protocols.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Third Parties</h3>
              <p className="text-gray-700">
                We do not share your files or personal information with third parties. Your data remains private and secure.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
