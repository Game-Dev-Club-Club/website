import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { subscribeZoom } from "./pages/Map/zoomStore";

export default function GlobalHUD() {
  const location = useLocation();
  const isMap = location.pathname === "/map";

  const [zoomK, setZoomK] = useState(1);

  useEffect(() => {
    return subscribeZoom(setZoomK);
  }, []);

  if (!isMap) return null;

  return (
    <div
      className={`
        fixed top-6 right-6 z-50
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

      <p className="text-sm retro-pixel-text text-black/80 max-w-xs font-cascadia">
        Hover over pins for info about a game dev club. Click to visit their site!
      </p>

      <p className="text-sm retro-pixel-text text-black/80 max-w-xs font-cascadia">
        Click a state to zoom in, and click again to zoom out.
      </p>
    </div>
  );
}