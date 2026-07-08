import { memo } from "react";
import { Marker, useMapContext } from "react-simple-maps";
import type { TooltipState } from "./types";

interface Props {
  tooltip: TooltipState;
  zoom: number;
  cx: number;
}

function MapTooltip({ tooltip, zoom, cx }: Props) {
  const { projection } = useMapContext();

  if (!tooltip.location) return null;

  const projectedCoords = projection(tooltip.location.coordinates);
  if (!projectedCoords) return null; 
  
  const [x] = projectedCoords;

  const TOOLTIP_WIDTH = 250;
  const OFFSET = 15;

  const shouldFlipLeft = x > cx;

  return (
    <Marker
      coordinates={tooltip.location.coordinates}
      style={{
        default: { pointerEvents: "none" },
        hover: { pointerEvents: "none" },
        pressed: { pointerEvents: "none" },
      }}
    >
      <g
        style={{
          transform: `scale(${1 / zoom})`,
          transition: "transform 800ms cubic-bezier(0.4,0,0.2,1)",
          willChange: "transform",
        }}
      >
        <foreignObject
          x={shouldFlipLeft ? -TOOLTIP_WIDTH - OFFSET : OFFSET}
          y={-45}
          width={TOOLTIP_WIDTH}
          height={150}
          className="pointer-events-none"
        >
          <div
            className={`
              pointer-events-none
              bg-white
              rounded-lg
              shadow-lg
              border
              border-(--blackberry)
              p-3
              transition-all
              duration-200
              ${shouldFlipLeft ? "origin-bottom-right" : "origin-bottom-left"}
              ${
                tooltip.show
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }
            `}
          >
            <div className="font-bold text-sm font-cascadia">
              {tooltip.location.name}
            </div>

            <div className="text-xs text-gray-600 font-cascadia">
              {tooltip.location.description}
            </div>
          </div>
        </foreignObject>
      </g>
    </Marker>
  );
}

export default memo(MapTooltip);