import { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';
import AnimatedRoutes from './components/AnimatedRoutes';
import GlobalHUD from "./GlobalHUD";
import NavigationArrows from "./components/NavigationArrows"; // 1. Import the new component

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
      
      {/* 2. Place the arrows here so they float globally over everything */}
      <NavigationArrows />

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