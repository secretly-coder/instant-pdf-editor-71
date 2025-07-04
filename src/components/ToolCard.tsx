
import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
}

const ToolCard = ({ icon: Icon, title, description, onClick, gradient }: ToolCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer hover:-translate-y-2 animate-fade-in"
    >
      <div className="relative z-10">
        <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors group-hover:shadow-lg group-hover:shadow-blue-500/25">
            <span>Get Started</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
