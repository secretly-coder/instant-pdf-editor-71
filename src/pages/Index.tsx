import React, { useState } from 'react';
import { Image, FileText, RotateCw } from 'lucide-react';
import Header from '../components/Header';
import ToolCard from '../components/ToolCard';
import ToolWorkspace from '../components/ToolWorkspace';
import RotationSettings from '../components/RotationSettings';
import PrivacyModal from '../components/PrivacyModal';
import TermsModal from '../components/TermsModal';

const Index = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(90);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const tools = [
    {
      id: 'image-to-pdf',
      icon: Image,
      title: 'Image to PDF',
      description: 'Convert JPG, PNG, and other image formats into a single PDF document with professional quality.',
      gradient: 'from-blue-500 to-blue-600',
      accept: 'image/*',
      multiple: false
    },
    {
      id: 'merge-pdf',
      icon: FileText,
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one comprehensive document while maintaining quality.',
      gradient: 'from-emerald-500 to-emerald-600',
      accept: '.pdf',
      multiple: true
    },
    {
      id: 'rotate-pdf',
      icon: RotateCw,
      title: 'Rotate PDF',
      description: 'Rotate PDF pages to fixed angles (90°, 180°, 270°, 360°) with precision.',
      gradient: 'from-orange-500 to-orange-600',
      accept: '.pdf',
      multiple: false
    }
  ];

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);
  };

  const handleBackToDashboard = () => {
    setActiveTool(null);
  };

  const getToolSettings = (toolId: string) => {
    if (toolId === 'rotate-pdf') {
      return (
        <RotationSettings onAngleChange={setRotationAngle} />
      );
    }
    return null;
  };

  const handleContactClick = () => {
    window.location.href = 'mailto:pdf.toolkit.official@gmail.com';
  };

  if (activeTool) {
    const tool = tools.find(t => t.id === activeTool);
    if (!tool) return null;

    return (
      <ToolWorkspace
        toolName={tool.title}
        toolDescription={tool.description}
        fileAccept={tool.accept}
        multiple={tool.multiple}
        onBack={handleBackToDashboard}
        rotationAngle={rotationAngle}
      >
        {getToolSettings(activeTool)}
      </ToolWorkspace>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            All-in-One <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">PDF Toolkit</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Convert, merge, and edit your PDF files with professional-grade tools. 
            Fast, secure, and completely free to use.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {tools.map((tool, index) => (
            <div 
              key={tool.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-scale-in"
            >
              <ToolCard
                icon={tool.icon}
                title={tool.title}
                description={tool.description}
                gradient={tool.gradient}
                onClick={() => handleToolClick(tool.id)}
              />
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-10 md:p-16 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Our PDF Toolkit?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Process your files in seconds with our optimized algorithms and modern technology
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your files are processed locally and never stored on our servers for maximum privacy
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Completely Free</h3>
              <p className="text-gray-600 leading-relaxed">
                All tools are free to use with no hidden fees, subscriptions, or limitations
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-100 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm mb-4 font-medium">
            © 2025 PDF Toolkit. Built with ❤️ for everyone who works with PDFs.
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <button 
              onClick={() => setShowPrivacyModal(true)}
              className="text-gray-500 hover:text-blue-600 transition-colors hover:underline underline-offset-4 font-medium"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setShowTermsModal(true)}
              className="text-gray-500 hover:text-blue-600 transition-colors hover:underline underline-offset-4 font-medium"
            >
              Terms of Service
            </button>
            <button 
              onClick={handleContactClick}
              className="text-gray-500 hover:text-blue-600 transition-colors hover:underline underline-offset-4 font-medium"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
    </div>
  );
};

export default Index;
