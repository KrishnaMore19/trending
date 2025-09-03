// src/pages/Home.jsx
import React, { useState } from "react";
import { scrapeTrends } from "../api/trends";
import { ScrapingProgress } from "../components/Loader";
import TrendCard from "../components/TrendCard";

const Home = () => {
  const [latestTrend, setLatestTrend] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState("");
  const [scrapingProgress, setScrapingProgress] = useState("");
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Timer for elapsed time during scraping
  const updateElapsedTime = () => {
    if (startTime) {
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    }
  };

  // Enhanced progress simulation with realistic steps
  const simulateProgress = () => {
    const steps = [
      { message: "🚀 Setting up Chrome browser...", duration: 3000 },
      { message: "🌐 Connecting to Twitter/X...", duration: 4000 },
      { message: "🔐 Authenticating account...", duration: 8000 },
      { message: "📱 Navigating to trending page...", duration: 5000 },
      { message: "🔍 Extracting trending topics...", duration: 12000 },
      { message: "⚡ Processing data...", duration: 4000 },
      { message: "💾 Saving to database...", duration: 3000 },
      { message: "✨ Finalizing results...", duration: 2000 }
    ];
    
    let stepIndex = 0;
    
    const scheduleNextStep = () => {
      if (stepIndex < steps.length && scraping) {
        const currentStep = steps[stepIndex];
        setScrapingProgress(currentStep.message);
        stepIndex++;
        setTimeout(scheduleNextStep, currentStep.duration);
      }
    };
    
    scheduleNextStep();
    
    // Update elapsed time every second
    const timeInterval = setInterval(updateElapsedTime, 1000);
    return timeInterval;
  };

  // Trigger scraping from API
  const handleScrape = async () => {
    try {
      setScraping(true);
      setError("");
      setStartTime(Date.now());
      setElapsedTime(0);
      setScrapingProgress("🎯 Initializing scraper...");
      
      // Start progress simulation
      const timeInterval = simulateProgress();
      
      const response = await scrapeTrends();
      setLatestTrend(response.data);
      setScrapingProgress("🎉 Scraping completed successfully!");
      setHasInitialLoad(true);
      
      // Clear intervals
      clearInterval(timeInterval);
      
      // Show success message briefly
      setTimeout(() => {
        setScrapingProgress("");
        setStartTime(null);
        setElapsedTime(0);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setError("Scraping failed: " + err.message);
      setScrapingProgress("❌ Scraping encountered an error");
      setHasInitialLoad(true);
      
      setTimeout(() => {
        setScrapingProgress("");
        setStartTime(null);
        setElapsedTime(0);
      }, 3000);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with gradient text */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            X Trending Topics Dashboard
          </h1>
          <p className="text-gray-600">Real-time trend analysis from X (formerly Twitter)</p>
        </div>

        {/* Single action button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleScrape}
            disabled={scraping}
            className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform shadow-lg ${
              scraping
                ? "bg-gray-400 cursor-not-allowed text-gray-700 scale-95"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 hover:shadow-xl"
            }`}
          >
            <div className="flex items-center space-x-3">
              {scraping ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="text-xl group-hover:animate-spin">🚀</span>
              )}
              <span>
                {scraping ? "Scraping in Progress..." : "Fetch Latest Trends"}
              </span>
            </div>
          </button>
        </div>

        {/* Enhanced Scraping Progress - simple spinner only */}
        <ScrapingProgress 
          progress={scrapingProgress}
          isActive={scraping}
        />

        {/* Enhanced error display */}
        {error && (
          <div className="animate-fadeInUp bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 mb-6 rounded-xl shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="text-2xl animate-bounce">⚠️</div>
              <div>
                <h3 className="text-red-800 font-bold text-lg mb-2">Oops! Something went wrong</h3>
                <p className="text-red-700 mb-2">{error}</p>
                <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-3">
                  <p className="text-red-600 text-sm font-medium mb-1">💡 Troubleshooting Tips:</p>
                  <ul className="text-red-600 text-sm space-y-1 list-disc list-inside">
                    <li>Check if the backend server is running</li>
                    <li>Verify Twitter/X credentials are valid</li>
                    <li>Ensure stable internet connection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trend card with animation */}
        {latestTrend && (
          <div className="animate-fadeInUp">
            <TrendCard trend={latestTrend} />
          </div>
        )}

        {/* Enhanced welcome screen */}
        {!scraping && !hasInitialLoad && (
          <div className="text-center mt-12 animate-fadeInUp">
            <div className="text-8xl mb-8 animate-float">📈</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Welcome to X Trends Dashboard
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Discover what's trending on X (Twitter) right now. Get real-time insights 
              into the most talked-about topics, hashtags, and conversations.
            </p>
            
            {/* Feature card */}
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-200">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="font-bold text-blue-700 mb-2">Fetch Latest Trends</h3>
                <p className="text-gray-600 text-sm">
                  Live scraping from X to get the most current trending topics and conversations
                </p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 bg-white/30 rounded-lg p-4 max-w-md mx-auto">
              <p className="font-medium mb-2">🔥 Ready to explore trends?</p>
              <p>Click the button above to get started with live data scraping!</p>
            </div>
          </div>
        )}

        {/* Enhanced "no data" message */}
        {hasInitialLoad && !latestTrend && !scraping && !error && (
          <div className="text-center mt-12 animate-fadeInUp">
            <div className="text-6xl mb-6 animate-bounce">🤷‍♂️</div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">No Trends Available</h3>
              <p className="text-gray-600 mb-6">
                It looks like there's no cached data available yet.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>💡 Try this option:</p>
                <p>🔵 Fetch fresh data from X</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;