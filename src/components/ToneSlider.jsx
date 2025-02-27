import { useState, useEffect } from 'react';

const ToneSlider = ({ onChange, defaultValue = 2 }) => {
  const [value, setValue] = useState(defaultValue);
  
  useEffect(() => {
    onChange(value);
  }, [value, onChange]);
  
  const getMarkerLabel = (position) => {
    switch(position) {
      case 0: return 'Subtle';
      case 1: return 'Casual';
      case 2: return 'Flirty';
      case 3: return 'Bold';
      case 4: return 'Spicy';
      default: return '';
    }
  };
  
  const getTrackColor = () => {
    // Create gradient based on position
    const percent = (value / 4) * 100;
    return `linear-gradient(to right, #4ECDC4 0%, #4ECDC4 ${percent}%, #E63946 ${percent}%, #E63946 100%)`;
  };
  
  return (
    <div className="w-full">
      {/* Larger touch target for mobile */}
      <input
        type="range"
        min="0"
        max="4"
        step="1"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="w-full h-2 md:h-2 rounded-lg appearance-none cursor-pointer touch-action-manipulation"
        style={{ 
          background: getTrackColor(),
          // Enhanced thumb size for mobile
          WebkitAppearance: 'none',
          borderRadius: '0.5rem',
        }}
      />
      <style jsx>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        
        input[type=range]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
      `}</style>
      
      <div className="relative flex justify-between mt-1">
        {[0, 1, 2, 3, 4].map((position) => (
          <div 
            key={position}
            className={`flex flex-col items-center transition-opacity duration-300 ${
              Math.abs(position - value) <= 1 ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div className={`w-1 h-1 rounded-full ${position === value ? 'bg-white' : 'bg-gray-500'}`}></div>
            {/* Show label only for current selection on mobile */}
            <span className={`text-xs text-gray-400 mt-1 ${position === value ? '' : 'hidden sm:inline'}`}>
              {getMarkerLabel(position)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Larger more visible current selection for mobile */}
      <div className="text-center mt-3">
        <span className="text-sm md:text-base font-medium" style={{ color: value > 2 ? '#E63946' : '#4ECDC4' }}>
          {getMarkerLabel(value)}
        </span>
      </div>
    </div>
  );
};

export default ToneSlider;
