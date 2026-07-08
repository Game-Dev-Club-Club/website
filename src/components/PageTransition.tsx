import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  // Synchronously check if our flag exists before rendering
  const skipIntro = typeof window !== "undefined" && sessionStorage.getItem("skipMapLoad") === "true";
  
  useEffect(() => {
    // If we skipped the intro, immediately delete the flag. 
    // This ensures if they navigate to other pages later, the intro plays normally.
    if (skipIntro) {
      sessionStorage.removeItem("skipMapLoad");
    }
  }, [skipIntro]);

  // If the flag is present, render the content immediately with NO animations
  if (skipIntro) {
    return (
      <div className="relative w-full min-h-screen">
        {children}
      </div>
    );
  }

  // Otherwise, render your normal animated loading screen!
  return (
    <div className="relative w-full min-h-screen">
      
      {/* 1. THE OVERLAY */}
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--blackberry)]"
        initial={{ y: 0 }}
        animate={{ y: "-100vh" }}
        transition={{ 
          duration: 0.8, 
          ease: "easeInOut", 
          delay: 1.5 
        }}
      >
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className="flex flex-col items-center text-center"
        >
          <h1 className="text-4xl font-hiruko text-white tracking-widest mb-4">
            game dev club club
          </h1>
          <p className="text-(--pale) font-cascadia uppercase animate-pulse">
            loading...
          </p>
        </motion.div>
      </motion.div>

      {/* 2. THE PAGE CONTENT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      >
        {children}
      </motion.div>
      
    </div>
  );
}