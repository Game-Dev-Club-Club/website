import { useEffect, useState, type ReactNode } from 'react';
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
  const isContact = location.pathname === "/contact-us";
  const [numOfClubs, setNumOfClubs] = useState(0);
  const [mapSidebar, setMapSidebar] = useState<ReactNode>(null);

  useEffect(() => {
    if (!isMap) {
      setMapSidebar(null);
    }
  }, [isMap]);

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

      <GlobalHUD numOfClubs={numOfClubs} mapSidebar={mapSidebar} />

      {/* 2. Place the arrows here so they float globally over everything */}
      <NavigationArrows />

      <PageTransition>
        <Navbar />

        <div className={`route-content ${isMap ? "route-map" : ""} ${isContact ? "route-contact" : ""}`}>
          <AnimatedRoutes setNumOfClubs={setNumOfClubs} setMapSidebar={setMapSidebar} />
        </div>
      </PageTransition>
    </>
  );
}

const App = () => {
  return (
    <Router>
      <div className={`app-background overflow-auto`}>
        <AppContent />
      </div>
    </Router>
  );
};

export default App;