
import React, { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Optimize images with lazy loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
    });

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload important fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);

      // Preload critical API data
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service worker registration failed, continue without it
        });
      }
    };

    preloadCriticalResources();

    // Optimize video loading
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.preload = 'metadata';
    });

    // Memory cleanup
    return () => {
      // Cleanup any observers or listeners
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
