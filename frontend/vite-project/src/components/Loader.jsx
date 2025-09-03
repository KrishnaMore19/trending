// src/components/Loader.jsx
import React from "react";

const Loader = ({ message = "Loading...", type = "default" }) => {
  // Different loader types for different contexts
  const loaderTypes = {
    default: (
      <div className="flex flex-col items-center justify-center py-16">
        {/* Simple spinner */}
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-600 font-medium text-lg">{message}</p>
      </div>
    ),

    scraping: (
      <div className="flex flex-col items-center justify-center py-12">
        {/* Simple spinner with different colors for scraping */}
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-700 font-semibold text-lg mb-2">{message}</p>
        <p className="text-gray-500 text-sm">Please wait while we fetch the data...</p>
      </div>
    ),

    minimal: (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600 font-medium">{message}</span>
      </div>
    )
  };

  return (
    <div className="flex justify-center items-center">
      {loaderTypes[type] || loaderTypes.default}
    </div>
  );
};

// Minimal Scraping Progress Component - only spinner and text
const ScrapingProgress = ({ 
  progress = "", 
  isActive = false 
}) => {
  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Simple spinner */}
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
      
      {/* Progress text */}
      <p className="text-gray-700 font-semibold text-lg text-center">
        {progress || "Scraping in progress..."}
      </p>
    </div>
  );
};

export default Loader;
export { ScrapingProgress };