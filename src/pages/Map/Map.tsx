import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import locations from "./Locations";
import { useState } from "react";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

function MapPage() {
  const [hovered, setHovered] = useState<Location | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto relative relative">
      <ComposableMap
        projection="geoAlbersUsa"
        className="w-full h-auto overflow-visible"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="
                  fill-gray-200
                  stroke-white
                  stroke-[0.5]
                  outline-none
                  hover:fill-gray-300
                  transition-colors
                "
              />
            ))
          }
        </Geographies>

        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinates={location.coordinates}
          >
            <g
              onMouseEnter={() => setHovered(location)}
              onMouseLeave={() => setHovered(null)}
            ></g>
            <g className="group cursor-pointer">
              {/* Pin */}
            <path
                d="M0 -12 C7 -12 12 -7 12 0 C12 8 0 18 0 18 C0 18 -12 8 -12 0 C-12 -7 -7 -12 0 -12Z"
                className="fill-red-500 stroke-white stroke-2 scale-30 hover:scale-80 clickable no-cursor"
            />

              {/* Tooltip */}
              <foreignObject
                x={10}
                y={-60}
                width={180}
                height={80}
                className="
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  pointer-events-none
                "
              >
                <div className="bg-white rounded-lg shadow-lg p-3 border">
                  <h3 className="font-cascadia text-sm">
                    {location.name}
                  </h3>

                  <p className="font-cascadia-italic text-xs text-gray-600">
                    {location.description}
                  </p>
                </div>
              </foreignObject>
            </g>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

export default MapPage;