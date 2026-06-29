import { useLocation, Routes, Route } from "react-router-dom";
import Home from "../pages/Homepage/Home";
import Contact from "../pages/Contact";
import Jam from "../pages/Jam";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-plop">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/jam" element={<Jam />} />
      </Routes>
    </div>
  );
}

