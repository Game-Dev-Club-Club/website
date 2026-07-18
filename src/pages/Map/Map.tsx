import { ComposableMap } from "react-simple-maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSchools } from "./Locations";
import MapStates from "./MapStates";
import SchoolMarkers from "./SchoolMarkers";
import MapTooltip from "./MapTooltip";
import type { SchoolMarker, TooltipState, ZoomParams } from "./types";
import { useNavigate } from "react-router-dom";
import { setZoomK } from "./zoomStore";
import { MapDirectory } from "./MapDirectory";

const DEFAULT_VIEWBOX = { x: 0, y: 0, width: 800, height: 600 };

function Map({ setNumOfClubs }: { setNumOfClubs: (num: number) => void }) {
  const navigate = useNavigate();
  const rawLocations = useSchools();

  const [loaded, setLoaded] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({
    location: null,
    show: false,
  });

  const [showNoLink, setShowNoLink] = useState(false);
  const [zoomStage, setZoomStage] = useState(0);
  const [activeState, setActiveState] = useState<string | null>(null);
  const [directoryHovered, setDirectoryHovered] = useState<SchoolMarker | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [zoomParams, setZoomParams] = useState({
    x: 0,
    y: 0,
    k: 1,
    cx: DEFAULT_VIEWBOX.width / 2, // <-- Track the SVG center X
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const locations = useMemo<SchoolMarker[]>(
    () =>
      rawLocations
        .filter((row) => row.Status?.trim() === "In The Discord")
        .map((row, index) => ({
          id: index,
          name: row["Club Name"]?.trim() || `${row.School} Game Dev Club`,
          description: row.School,
          coordinates: row.coordinates,
          link: row["Club Link"],
          region: row.Region
        }))
        .filter((l) => l.coordinates[0] !== 0 || l.coordinates[1] !== 0),
    [rawLocations]
  );

  useEffect(() => {
    console.log("Number of clubs:", locations.length);
    console.log("Locations:", locations);
    setNumOfClubs(locations.length);
  }, [locations, setNumOfClubs]);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (e.propertyName !== "transform") return;
      setIsAnimating(false);
    },
    []
  );

  const zoomTo = useCallback((target: ZoomParams["viewBox"]) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const intrinsicWidth = wrapper.clientWidth;
    const intrinsicHeight = wrapper.clientHeight;

    const k = DEFAULT_VIEWBOX.width / target.width;

    const centerX = target.x + target.width / 2;
    const centerY = target.y + target.height / 2;

    const cxPx = (centerX / DEFAULT_VIEWBOX.width) * intrinsicWidth;
    const cyPx = (centerY / DEFAULT_VIEWBOX.height) * intrinsicHeight;

    const tx = intrinsicWidth / 2 - cxPx * k;
    const ty = intrinsicHeight / 2 - cyPx * k;

    setIsAnimating(true);

    setZoomParams({
      x: tx,
      y: ty,
      k: k,
      cx: centerX, // <-- Update visible center X
    });
  }, []);

  useEffect(() => {
    setZoomK(zoomParams.k);
  }, [zoomParams.k]);

  const resetZoom = () => {
    sessionStorage.setItem("skipMapLoad", "true");
    navigate(".", { replace: true });
  };

  return (
    <div className="mt-0 md:mt-[-5rem] relative w-full aspect-[4/3] overflow-visible rounded-xl flex items-center justify-center">
      <div className="w-full max-w-4xl aspect-[4/3] relative overflow-visible rounded-xl">
        <div
          ref={wrapperRef}
          className="absolute inset-0 w-full h-full"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translate3d(${zoomParams.x}px, ${zoomParams.y}px, 0) scale3d(${zoomParams.k}, ${zoomParams.k}, 1)`,
            transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
            transformOrigin: "0 0",
            willChange: isAnimating ? "transform" : "auto",
          }}
        >
          <ComposableMap
            projection="geoAlbersUsa"
            viewBox="0 0 800 600"
            className="w-full h-full overflow-visible"
            onClick={() => {
              if (activeState === null) return;
              resetZoom();
            }}
          >
            <MapStates
              activeState={activeState}
              setActiveState={setActiveState}
              zoomStage={zoomStage}
              setZoomStage={setZoomStage}
              zoomTo={zoomTo}
              resetZoom={resetZoom}
            />

            <SchoolMarkers
              locations={locations}
              loaded={loaded}
              zoom={zoomParams.k}
              setTooltip={setTooltip}
              setShowNoLink={setShowNoLink}
              directoryHovered={directoryHovered}
            />

            {/* Pass cx down to the tooltip */}
            <MapTooltip
              tooltip={tooltip}
              zoom={zoomParams.k}
              cx={zoomParams.cx}
            />
          </ComposableMap>
          <MapDirectory
            locations={locations}
            setHovered={setDirectoryHovered}
          />
        </div>
      </div>
      <div
        className={`
          fixed top-8 left-1/2 -translate-x-1/2 z-50
          bg-[var(--blackberry)] text-white px-4 py-2
          rounded-full shadow-lg pointer-events-none
          transition-all duration-300 font-cascadia
          ${showNoLink ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        `}
      >
        No link yet
      </div>
    </div>
  );
}

export default Map;