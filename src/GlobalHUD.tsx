import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { subscribeZoom } from "./pages/Map/zoomStore";

export default function GlobalHUD() {
  const location = useLocation();
  const isMap = location.pathname === "/map";

  const [zoomK, setZoomK] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    return subscribeZoom(setZoomK);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  if (!isMap) return null;

  return (
    <div
      className={`
        fixed top-[calc(1.5rem+env(safe-area-inset-top))] right-[calc(1.5rem+env(safe-area-inset-right))] z-50
        text-right
        transition-all duration-500 ease-out
        pointer-events-none
        ${
          zoomK !== 1
            ? "opacity-0 translate-y-2"
            : "opacity-100 translate-y-0"
        }
      `}
    >
      <h1 className="text-2xl font-bold retro-pixel-text text-black drop-shadow font-hiruko">
        Game Dev Clubs
      </h1>

      {!isMobile && (
        <>
          <p className="text-sm retro-pixel-text text-black/80 max-w-xs font-cascadia">
            Hover over pins for info about a game dev club. Click to visit their site!
          </p>

          <p className="text-sm retro-pixel-text text-black/80 max-w-xs font-cascadia">
            Click a state to zoom in, and click again to zoom out.
          </p>
        </>
      )}

      {isMobile && (
        <p className="text-xs retro-pixel-text text-black/80 max-w-[10rem] font-cascadia">
          Tap a pin for info, tap again to visit. Tap a state to zoom.
        </p>
      )}
    </div>
  );
}