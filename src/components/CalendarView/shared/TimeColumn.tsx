import React from 'react';

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export const TimeColumn: React.FC = () => {
  return (
    <div className="flex flex-col space-y-0">
      <div className="h-12"></div> {/* Placeholder for aligning hours with days */}
      {hours.map((hour, index) => (
        <div
          key={index}
          className="text-sm text-white bg-indigo-600 h-24 flex items-center justify-center border-b border-gray-200"
        >
          {hour}
        </div>
      ))}
    </div>
  );
};
