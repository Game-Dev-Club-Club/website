import { useRef, useEffect, type Dispatch, type SetStateAction } from "react"

import { createBallPit } from "./createBallPit"
import type { Logo } from "./types"

interface BallPitProps {
  logos: Logo[];
  selectedIndex: number,
  setSelectedIndex: Dispatch<SetStateAction<number>>
}

export default function BallPit({ logos, selectedIndex, setSelectedIndex }: BallPitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const elRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const world = worldRef.current;
    if (!container || !world) return;

    const pit = createBallPit({
      container,
      world,
      elements: elRefs.current,
      logos
    });
    return () => pit.destroy();
  }, [logos]);

  return (<>
    <div ref={containerRef} className="pit">
      <div ref={worldRef} className="pit_world">
        {logos.map((logo, i) => (
          <img
            key={i}
            ref={(el) => {
              elRefs.current[i] = el;
            }}
            className={`pit_logo ${selectedIndex === i ? "selected" : ""}`}
            src={logo.src}
            alt={logo.alt}
            draggable={false}
            onMouseDown={() => setSelectedIndex(i)}
          />
        ))}
      </div>
    </div>
  </>);
}
