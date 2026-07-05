import { memo, useCallback, useMemo } from "react";
import { Geographies, Geography } from "react-simple-maps";
import type { ZoomParams } from "./types";

// Import just the single topology you want to use
import statesTopology from "../../assets/states-10m.json"; 

const MAX_SCALE = 12;
const SUPER_ZOOM_MULTIPLIER = 2.75;

const DEFAULT_VIEWBOX = { x: 0, y: 0, width: 800, height: 600 };

interface Props {
  activeState: string | null;
  setActiveState: React.Dispatch<React.SetStateAction<string | null>>;
  zoomStage: number;
  setZoomStage: React.Dispatch<React.SetStateAction<number>>;
  zoomTo: (target: ZoomParams["viewBox"]) => void;
  resetZoom: () => void;
}

function MapStates({
  activeState,
  setActiveState,
  zoomStage,
  setZoomStage,
  zoomTo,
  resetZoom,
}: Props) {
const handleClick = useCallback(
  (e: React.MouseEvent<SVGPathElement>, geo: any) => {
    e.stopPropagation();

    if (!geo?.rsmKey) return; // safety guard

    const path = e.currentTarget;

    const isSameState = activeState === geo.rsmKey;
    const nextStage = isSameState ? zoomStage + 1 : 1;

    if (nextStage >= 3) {
      resetZoom();
      return;
    }

    const bbox = path.getBBox();

    let targetX = bbox.x + bbox.width / 2;
    let targetY = bbox.y + bbox.height / 2;

    if (nextStage === 2 && path.ownerSVGElement) {
      const svg = path.ownerSVGElement;
      const pt = svg.createSVGPoint();

      pt.x = e.clientX;
      pt.y = e.clientY;

      const screenCTM = svg.getScreenCTM();
      if (screenCTM) {
        const svgP = pt.matrixTransform(screenCTM.inverse());
        targetX = svgP.x;
        targetY = svgP.y;
      }
    }

    const fitScale =
      Math.min(
        DEFAULT_VIEWBOX.width / bbox.width,
        DEFAULT_VIEWBOX.height / bbox.height
      ) * 0.6;

    const baseScale = Math.max(1.5, fitScale);

    const absoluteScale =
      nextStage === 1
        ? baseScale
        : Math.min(baseScale * SUPER_ZOOM_MULTIPLIER, MAX_SCALE);

    const targetWidth = DEFAULT_VIEWBOX.width / absoluteScale;
    const targetHeight = DEFAULT_VIEWBOX.height / absoluteScale;

    setActiveState(geo.rsmKey);
    setZoomStage(nextStage);

    zoomTo({
      x: targetX - targetWidth / 2,
      y: targetY - targetHeight / 2,
      width: targetWidth,
      height: targetHeight,
    });
  },
  [activeState, zoomStage, setActiveState, setZoomStage, zoomTo]
);  
const geoClass = useMemo(
    () => ({
      base: "fill-gray-200 stroke-[var(--blackberry-faded)] stroke-[0.5] outline-none hover:fill-gray-300 cursor-pointer",
      active: "fill-gray-300",
    }),
    []
  );

  return (
    <Geographies geography={statesTopology}>
      {({ geographies }) =>
        geographies.map((geo) => {
          const isActive = activeState === geo.rsmKey;
          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              vectorEffect="non-scaling-stroke"
              onClick={(e) => handleClick(e, geo)}
              className={`${geoClass.base} ${isActive ? geoClass.active : ""}`}
            />
          );
        })
      }
    </Geographies>
  );
}

export default memo(MapStates);