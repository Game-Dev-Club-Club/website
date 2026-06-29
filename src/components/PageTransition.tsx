import React from 'react';
import { motion } from 'framer-motion';
// If you want to use the missing textures image in the loading screen:
// import missing from '../assets/img/Missing_Textures_artwork.jpg';

export default function PageTransition({ children }) {
  return (
    <div className="relative w-full min-h-screen">
      
      {/* 1. THE OVERLAY (The full screen start color/component) */}
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--blackberry)]"
        initial={{ y: 0 }}             // Start fully covering the screen
        animate={{ y: "-100vh" }}      // Slide up and out of the way
        transition={{ 
          duration: 0.8, 
          ease: "easeInOut", 
          delay: 1.5                   // Wait 1.5 seconds before sliding away
        }}
      >
        {/* You can put ANY component inside this overlay! */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }} // Fade out slightly before the slide
          className="flex flex-col items-center text-center"
        >
          <h1 className="text-4xl font-hiruko text-white tracking-widest mb-4">
            game dev club club
          </h1>
          <p className="text-zinc-400 font-cascadia uppercase animate-pulse">
            loading...
          </p>
        </motion.div>
      </motion.div>

      {/* 2. THE PAGE CONTENT (The actual screen being revealed) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} // Start slightly transparent and zoomed out
        animate={{ opacity: 1, scale: 1 }}    // Snap to full size and visibility
        transition={{ duration: 0.5, delay: 1.6 }} // Trigger right as the curtain lifts
      >
        {children}
      </motion.div>
      
    </div>
  );
}