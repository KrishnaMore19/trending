// src/components/TrendCard.jsx
import React from "react";

const TrendCard = ({ trend }) => {
  if (!trend) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return dateString || 'Unknown date';
    }
  };

  const formatTrend = (trendText) => {
    if (!trendText) return 'N/A';
    
    // Check if it's a hashtag
    if (trendText.startsWith('#')) {
      return (
        <span className="inline-flex items-center">
          <span className="text-blue-600 font-semibold">{trendText}</span>
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            hashtag
          </span>
        </span>
      );
    }
    
    // Check if it contains non-English characters (Hindi, etc.)
    const hasUnicode = /[^\x00-\x7F]/.test(trendText);
    if (hasUnicode) {
      return (
        <span className="inline-flex items-center">
          <span className="font-medium">{trendText}</span>
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            regional
          </span>
        </span>
      );
    }
    
    return <span className="font-medium">{trendText}</span>;
  };

  const getStatusColor = (trendText) => {
    if (trendText && trendText.toLowerCase().includes('error')) {
      return 'bg-red-50 border-red-200';
    }
    return 'bg-white border-gray-200';
  };

  const trends = [
    trend.trend1,
    trend.trend2, 
    trend.trend3,
    trend.trend4,
    trend.trend5
  ].filter(Boolean);

  return (
    <div className={`rounded-lg shadow-md p-6 ${getStatusColor(trend.trend1)} border`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="text-2xl mr-2">📈</span>
          Trending Topics
        </h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">Scraped on</p>
          <p className="text-lg font-semibold text-gray-700">
            {formatDate(trend.datetime)}
          </p>
        </div>
      </div>

      {/* Trends List */}
      <div className="space-y-4 mb-6">
        {trends.map((trendText, index) => (
          <div 
            key={index}
            className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
              {index + 1}
            </div>
            <div className="flex-grow">
              {formatTrend(trendText)}
            </div>
            {trendText && trendText.startsWith('#') && (
              <div className="text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-blue-500 mr-1">🌐</span>
              <span className="font-medium">IP Address:</span>
              <code className="ml-1 px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                {trend.ip || 'Unknown'}
              </code>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-1">🆔</span>
              <span className="font-medium">ID:</span>
              <code className="ml-1 px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                {trend.id ? trend.id.substring(0, 8) + '...' : 'Unknown'}
              </code>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-1">⚡</span>
            <span>Auto-scraped from X/Twitter</span>
          </div>
        </div>
      </div>
      
      {/* Success/Error Status */}
      {trend.trend1 && trend.trend1.toLowerCase().includes('error') ? (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">
            ⚠️ Scraping encountered issues. Please try again.
          </p>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            ✅ Successfully scraped {trends.length} trending topics
          </p>
        </div>
      )}
    </div>
  );
};

export default TrendCard;