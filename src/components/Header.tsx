
import React from 'react';
import { FileText } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PDF Toolkit</h1>
            <p className="text-sm text-gray-500 font-medium">All-in-one PDF solutions</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Fast • Secure • Free</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
