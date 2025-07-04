
import React, { useState, useEffect } from 'react';

interface RotationSettingsProps {
  onAngleChange?: (angle: number) => void;
  initialAngle?: number;
}

const RotationSettings = ({ 
  onAngleChange, 
  initialAngle = 90
}: RotationSettingsProps) => {
  const [angle, setAngle] = useState(initialAngle);

  useEffect(() => {
    onAngleChange?.(angle);
  }, [angle, onAngleChange]);

  const handleQuickAngle = (quickAngle: number) => {
    setAngle(quickAngle);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Rotation Settings</h3>
      <div className="space-y-6">
        {/* Angle Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {angle}°
          </div>
          <p className="text-sm text-gray-500">Selected rotation angle</p>
        </div>

        {/* Fixed Angle Buttons */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Choose Rotation Angle
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[90, 180, 270, 360].map((quickAngle) => (
              <button
                key={quickAngle}
                onClick={() => handleQuickAngle(quickAngle)}
                className={`px-4 py-3 text-sm font-medium border rounded-lg transition-colors ${
                  angle === quickAngle
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {quickAngle}°
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Select from standard rotation angles
          </p>
        </div>

        {/* Visual Preview */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Preview
          </label>
          <div className="flex justify-center">
            <div className="w-16 h-20 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center relative">
              <div
                className="w-12 h-16 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-xs text-blue-600 font-medium transition-transform duration-300"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                PDF
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Preview of rotation effect
          </p>
        </div>
      </div>
    </div>
  );
};

export default RotationSettings;
