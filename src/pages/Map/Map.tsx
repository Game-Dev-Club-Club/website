import { ComposableMap } from "react-simple-maps";
import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useSchools } from "./Locations";
import MapStates from "./MapStates";
import SchoolMarkers from "./SchoolMarkers";
import MapTooltip from "./MapTooltip";
import type { SchoolMarker, TooltipState, ZoomParams } from "./types";
import { useNavigate } from "react-router-dom";
import { setZoomK } from "./zoomStore";
import { MapDirectory } from "./MapDirectory";
import "./Map.css";

const DEFAULT_VIEWBOX = { x: 0, y: 0, width: 800, height: 600 };

function Map({
  setMapSidebar,
}: {
  setMapSidebar: Dispatch<SetStateAction<ReactNode>>;
}) {
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
  const [isDesktop, setIsDesktop] = useState(() =>
    window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
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

  // useEffect(() => {
  //   if (!isDesktop) {
  //     setMapSidebar(null);
  //     return;
  //   }
  //   setMapSidebar(
  //     <MapDirectory locations={locations} setHovered={setDirectoryHovered} />
  //   );
  //   return () => setMapSidebar(null);
  // }, [isDesktop, locations, setMapSidebar]);

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
    <div>
      <div className="mt-0 md:mt-[calc(5rem-10vh)] h-[50vh] relative w-screen overflow-visible rounded-xl flex items-center justify-center flex-row">
        <div className="w-[50vw] max-w-6xl aspect-[4/3] relative overflow-visible rounded-xl ml-auto mr-auto">
          <h1 className="text-2xl font-bold text-black drop-shadow font-cascadia block text-center">
            Total Number of Clubs: {locations.length}
          </h1>
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
          </div>
        </div>
        {
          isDesktop && (
            < div
              className="
            overflow-y-auto max-h-[40vh] map-club-list-scroll right-0 max-w-[40vh]
            ml-auto
            w-[50vw]
          "
            >
              <MapDirectory locations={locations} setHovered={setDirectoryHovered} />
            </div>)
        }
        {!isDesktop && (
          <div
            className="
            md:hidden fixed z-40 overflow-y-auto max-h-50 map-club-list-scroll
            bottom-[calc(1.5rem+env(safe-area-inset-bottom))]
            left-[calc(1.5rem+env(safe-area-inset-left))]
            right-[calc(1.5rem+env(safe-area-inset-right))]
          "
          >
            <MapDirectory locations={locations} setHovered={setDirectoryHovered} />
          </div>
        )}
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
    </div>
  );
}

export default Map;