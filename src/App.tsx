import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';
import AnimatedRoutes from './components/AnimatedRoutes';
import GlobalHUD from "./GlobalHUD";

import "./App.css";

function AppContent() {
  const location = useLocation();
  const isMap = location.pathname === "/map";

  useEffect(() => {
    if (isMap) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMap]);

  return (
    <>
      <div className="fixed inset-0 -z-10 diagonal-bg" />
      <CustomCursor />

      <GlobalHUD />

      <PageTransition>
        <Navbar />

<div className={`route-content ${isMap ? "route-map" : ""}`}>
            <AnimatedRoutes />
        </div>
      </PageTransition>
    </>
  );
}

const App = () => {
  return (
    <Router>
      <div className={`app-background`}>
        <AppContent />
      </div>
    </Router>
  );
};

export default App;