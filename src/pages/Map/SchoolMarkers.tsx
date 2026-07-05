import { memo, useEffect, useRef, useState } from "react";
import { Marker } from "react-simple-maps";
import type { SchoolMarker, TooltipState } from "./types";

interface Props {
  locations: SchoolMarker[];
  loaded: boolean;
  zoom: number;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
  setShowNoLink: React.Dispatch<React.SetStateAction<boolean>>;
}

function SchoolMarkers({
  locations,
  loaded,
  zoom,
  setTooltip,
  setShowNoLink,
}: Props) {
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  // What's hovered right this moment — drives the grow/shrink animation
  // AND which marker currently owns real interaction on the overlay.
  const [hoveredId, setHoveredId] = useState<SchoolMarker["id"] | null>(null);

  // The last marker that was hovered. Stays set after mouse leave — this
  // is what keeps a pin (and, while actively hovered, its hitbox) sitting
  // above every neighbor instead of reverting to array-order stacking.
  const [elevatedId, setElevatedId] = useState<SchoolMarker["id"] | null>(null);

  const [popIn, setPopIn] = useState(false);

  useEffect(() => {
    if (hoveredId != null) {
      const raf = requestAnimationFrame(() => setPopIn(true));
      return () => cancelAnimationFrame(raf);
    }
    setPopIn(false);
  }, [hoveredId]);

  const renderPin = (hidden = false) => (
    <>
      <circle
        cx="0"
        cy="-7.5"
        r="12"
        fill="transparent"
        className="clickable transition-transform group-hover:scale-125"
      />

      <path
        d="M0 -15 C3.5 -15 6 -12.5 6 -9 C6 -5 0 0 0 0 C0 0 -6 -5 -6 -9 C-6 -12.5 -3.5 -15 0 -15Z"
        className="
        fill-red-500
        stroke-white
        stroke-2
        transition-transform
        group-hover:scale-125
        clickable"
        style={hidden ? { opacity: 0 } : undefined}
      />
    </>
  );

  const elevatedLocation =
    elevatedId != null
      ? locations.find((l) => l.id === elevatedId) ?? null
      : null;

  const handleEnter = (location: SchoolMarker) => {
    setHoveredId(location.id);
    setElevatedId(location.id);
    setTooltip({ location, show: true });
  };

  const handleLeave = (locationId: SchoolMarker["id"]) => {
    setHoveredId((p) => (p === locationId ? null : p));
    setTooltip((p) => ({ ...p, show: false }));
  };

  const handleActivate = (location: SchoolMarker) => (e: React.MouseEvent) => {
    e.stopPropagation();

    if (location.link) {
      window.open(location.link, "_blank", "noopener,noreferrer");
    } else {
      setShowNoLink(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setShowNoLink(false), 2000);
    }
  };

  return (
    <>
      {locations.map((location, i) => {
        // Once a marker becomes the active hover target, it's fully taken
        // over by the overlay below — both its visuals AND its hit
        // testing. Disabling pointerEvents here means this in-place copy
        // can never again steal a neighbor's hover/leave, no matter what
        // order they sit in within the SVG.
        const isOwnedByOverlay = location.id === hoveredId;

        return (
          <Marker
            key={location.id}
            coordinates={location.coordinates}
          >
            <g
              className="group cursor-pointer"
              style={{
                pointerEvents: isOwnedByOverlay ? "none" : "auto",
                transform: loaded
                  ? `translateY(0px) scale(${1 / zoom})` 
                  : `translateY(-20px) scale(0.5)`,
                opacity: loaded ? 1 : 0,
                transition:
                  `transform 800ms cubic-bezier(0.4,0,0.2,1),
                   opacity 500ms ease-out ${i * 100}ms`,
                willChange: "transform, opacity",
              }}
              onMouseEnter={() => handleEnter(location)}
              onMouseLeave={() => handleLeave(location.id)}
              onClick={handleActivate(location)}
            >
              {/* Hidden once elevated, whether or not it's the one
                  currently hovered — the overlay renders the pin from
                  here on. */}
              {renderPin(location.id === elevatedId)}
            </g>
          </Marker>
        );
      })}

      {/* Overlay: painted last, so both its visuals AND its hitbox sit
          above every marker, including ones later in the array. */}
      {elevatedLocation && (
        <Marker coordinates={elevatedLocation.coordinates}>
          {/* OUTER GROUP: Syncs perfectly with the map's 800ms zoom animations */}
          <g
            style={{
              pointerEvents: hoveredId === elevatedId ? "auto" : "none",
              transform: `scale(${1 / zoom})`,
              transition: "transform 800ms cubic-bezier(0.4,0,0.2,1)",
              willChange: "transform",
            }}
          >
            {/* INNER GROUP: Handles the snappy 200ms hover pop independently */}
            <g
              className="cursor-pointer"
              style={{
                transform: `scale(${hoveredId === elevatedId && popIn ? 1.25 : 1})`,
                transition: "transform 200ms cubic-bezier(0.4,0,0.2,1)",
                willChange: "transform",
              }}
              onMouseEnter={() => handleEnter(elevatedLocation)}
              onMouseLeave={() => handleLeave(elevatedLocation.id)}
              onClick={handleActivate(elevatedLocation)}
            >
              {renderPin()}
            </g>
          </g>
        </Marker>
      )}
    </>
  );
}

export default memo(SchoolMarkers);