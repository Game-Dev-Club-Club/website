import { useLocation, Routes, Route } from "react-router-dom";
import Home from "../pages/Homepage/Home";
import Contact from "../pages/Contact/Contact";
import Jam from "../pages/Jam/Jam";
import Map from "../pages/Map/Map";
import Sponsors from "../pages/Sponsors/Sponsors";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    // Change location.pathname to location.key
    <div key={location.key} className="page-plop">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/map" element={<Map />} />
        <Route path="/jam" element={<Jam />} />
        <Route path="/sponsors" element={<Sponsors />} />
      </Routes>
    </div>
  );
}