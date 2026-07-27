import { useLocation, Routes, Route } from "react-router-dom";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import Home from "../pages/Homepage/Home";
import Contact from "../pages/Contact";
import Jam from "../pages/Jam";
import Map from "../pages/Map/Map";

export default function AnimatedRoutes({
  setNumOfClubs,
  setMapSidebar,
}: {
  setNumOfClubs: (num: number) => void;
  setMapSidebar: Dispatch<SetStateAction<ReactNode>>;
}) {
  const location = useLocation();

  return (
    // Change location.pathname to location.key
    <div key={location.key} className="page-plop">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/map" element={<Map setNumOfClubs={setNumOfClubs} setMapSidebar={setMapSidebar} />} />
        <Route path="/jam" element={<Jam />} />
      </Routes>
    </div>
  );
}