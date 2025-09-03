// src/pages/Scraper.jsx
import React, { useState } from "react";
import { scrapeTrends } from "../api/trends";
import TrendCard from "../components/TrendCard";

const Scraper = () => {
  const [latestTrend, setLatestTrend] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState("");
  const [scrapingProgress, setScrapingProgress] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer for elapsed time during scraping
  const updateElapsedTime = () => {
    if (startTime) {
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    }
  };

  // Simulate progress updates during scraping
  const simulateProgress = () => {
    const steps = [
      { message: "Setting up Chrome browser...", duration: 5000 },
      { message: "Connecting to Twitter/X...", duration: 8000 },
      { message: "Logging into account...", duration: 15000 },
      { message: "Navigating to trending page...", duration: 8000 },
      { message: "Extracting trending topics...", duration: 10000 },
      { message: "Processing data...", duration: 5000 },
      { message: "Saving to database...", duration: 3000 },
      { message: "Finalizing results...", duration: 5000 }
    ];
    
    let stepIndex = 0;
    let totalTime = 0;
    
    const scheduleNextStep = () => {
      if (stepIndex < steps.length && scraping) {
        const currentStep = steps[stepIndex];
        setScrapingProgress(currentStep.message);
        stepIndex++;
        totalTime += currentStep.duration;
        
        setTimeout(scheduleNextStep, currentStep.duration);
      }
    };
    
    scheduleNextStep();
    
    // Also update elapsed time every second
    const timeInterval = setInterval(updateElapsedTime, 1000);
    
    return timeInterval;
  };

  const handleScrape = async () => {
    try {
      setScraping(true);
      setError("");
      setLatestTrend(null);
      setStartTime(Date.now());
      setElapsedTime(0);
      setScrapingProgress("Initializing scraper...");
      
      // Start progress simulation and timer
      const timeInterval = simulateProgress();
      
      const response = await scrapeTrends();
      setLatestTrend(response.data);
      setScrapingProgress("✅ Scraping completed successfully!");
      
      // Clear intervals
      clearInterval(timeInterval);
      
      // Show success message briefly then clear
      setTimeout(() => {
        setScrapingProgress("");
        setStartTime(null);
        setElapsedTime(0);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setError(`Scraping failed: ${err.message}`);
      setScrapingProgress("❌ Scraping failed");
      
      setTimeout(() => {
        setScrapingProgress("");
        setStartTime(null);
        setElapsedTime(0);
      }, 3000);
    } finally {
      setScraping(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Manual Scraping
        </h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleScrape}
            disabled={scraping}
            className={`px-8 py-4 rounded-lg font-semibold transition-colors shadow-md text-lg ${
              scraping
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg transform hover:scale-105"
            }`}
          >
            {scraping ? "🔄 Scraping in Progress..." : "🚀 Start Scraping"}
          </button>
        </div>

        {/* Enhanced Progress Indicator */}
        {scraping && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-6 mb-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div>
                <h3 className="text-lg font-semibold text-green-700">
                  Scraping in Progress
                </h3>
              </div>
              {startTime && (
                <div className="text-right">
                  <span className="text-sm text-gray-600">Elapsed Time:</span>
                  <div className="text-xl font-mono font-bold text-green-600">
                    {formatTime(elapsedTime)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <p className="text-green-700 font-medium">
                {scrapingProgress || "Initializing..."}
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${Math.min(100, (elapsedTime / 120) * 100)}%` // Assume 2 min max
                }}
              ></div>
            </div>
            
            <div className="text-sm text-green-600 space-y-1">
              <p>• This process typically takes 1-2 minutes</p>
              <p>• Chrome browser is automatically controlled</p>
              <p>• Please don't close this window</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <div className="flex items-center">
              <span className="text-red-400 text-xl mr-2">⚠️</span>
              <div>
                <p className="text-red-700 font-medium">Scraping Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <p className="text-red-500 text-xs mt-2">
                  Tip: Make sure your Twitter credentials are correct and the backend is running.
                </p>
              </div>
            </div>
          </div>
        )}

        {latestTrend && (
          <div className="animate-fadeIn">
            <TrendCard trend={latestTrend} />
          </div>
        )}

        {!latestTrend && !scraping && !error && (
          <div className="text-center mt-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg mb-2">
              Ready to scrape the latest trends
            </p>
            <p className="text-gray-400 text-sm">
              Click the button above to start the scraping process
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scraper;