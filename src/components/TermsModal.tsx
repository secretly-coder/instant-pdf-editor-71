
import React from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Terms & Conditions</h2>
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
              By using this service, you agree not to upload illegal or copyrighted content. This tool is provided as-is without any warranty.
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Acceptable Use</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Do not upload files containing illegal content</li>
                <li>Do not upload copyrighted material without permission</li>
                <li>Do not attempt to upload malicious files or scripts</li>
                <li>Use the service only for legitimate file processing purposes</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Service Availability</h3>
              <p className="text-gray-700 mb-4">
                We strive to provide reliable service but cannot guarantee 100% uptime. The service is provided "as-is" without warranties of any kind.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                We are not liable for any damages resulting from the use of this service, including but not limited to data loss, corruption, or security breaches.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Changes to Terms</h3>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.
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

export default TermsModal;
