import { useEffect, useRef, type MouseEvent, type TouchEvent } from "react";

const one = "We are student game developers from over 70 university clubs around the world!";
const two = "We want to bridge gaps and bring collegiate game development clubs together!";
const three = "We are building an awesome community through fun global events, jams, and collaborations!";

type Panel = {
  id: number;
  title: string;
  text: string;
};
function InteractivePanel({ panel }: { panel: Panel }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // We track x, y, and r (radius)
  const target = useRef({ x: 0, y: 0, r: 0 });
  const current = useRef({ x: 0, y: 0, r: 0 });

  useEffect(() => {
    let frame: number;

    const animate = () => {
      //Keep the position tracking responsive
      const posLerp = 0.1;

      // Make the radius expansion much slower (0.03) than the shrinking (0.15)
      const isGrowing = target.current.r > 0;
      const radiusLerp = isGrowing ? 0.03 : 0.15;

      // Smoothly interpolate position and radius
      current.current.x += (target.current.x - current.current.x) * posLerp;
      current.current.y += (target.current.y - current.current.y) * posLerp;
      current.current.r += (target.current.r - current.current.r) * radiusLerp;

      // Apply the expanding/moving clipping mask
      if (revealRef.current) {
        revealRef.current.style.clipPath =
          `circle(${current.current.r}px at ${current.current.x}px ${current.current.y}px)`;
      }

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Helper to grab coordinates from either a mouse or a touch event
  const getCoordinates = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if ("touches" in e) {
      return {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      };
    }
    return {
      clientX: e.clientX,
      clientY: e.clientY,
    };
  };

  const handleMove = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const { clientX, clientY } = getCoordinates(e);
    
    target.current.x = clientX - rect.left;
    target.current.y = clientY - rect.top;
  };

  const handleEnter = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const { clientX, clientY } = getCoordinates(e);

    // Instantly snap the starting circle to the touch/mouse position 
    // so it doesn't fly in from the top left corner (0,0)
    const startX = clientX - rect.left;
    const startY = clientY - rect.top;

    current.current.x = startX;
    current.current.y = startY;
    target.current.x = startX;
    target.current.y = startY;

    // Set target radius large enough to cover the whole box
    target.current.r = 800; 
  };

  const handleLeave = () => {
    // Shrink the circle back to nothing
    target.current.r = 0;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
      className="relative overflow-hidden no-cursor rounded-lg min-h-[150px]
      flex items-center justify-center text-center bg-white
      transition-transform duration-200 ease-in-out odd:-rotate-2 even:rotate-2 hover:-translate-y-1 shadow-md hover:rotate-0"
    >
      {/* Base Layer (Title) */}
      <h2 className="text-2xl font-cascadia text-(--blackberry) px-5 py-8">
        {panel.title}
      </h2>

      {/* --- ADDED THIS SPAN HERE --- */}
      {/* Tiny Hint Text */}
      <span className="absolute bottom-2 text-[0.75rem] opacity-40 font-cascadia text-(--blackberry) pointer-events-none">
        Hover or Tap to Reveal
      </span>

      {/* Reveal Layer (Expands on Hover/Touch) */}
      <div
        ref={revealRef}
        className="absolute inset-0 flex items-center justify-center text-center bg-white px-5 py-8 z-10 pointer-events-none"
        style={{ clipPath: "circle(0px at 0px 0px)" }}
      >
        <p className="text-sm font-cascadia text-(--blackberry) leading-relaxed">
          {panel.text}
        </p>
      </div>
    </div>
  );
}

function HomepageDescription() {
  const panels: Panel[] = [
    { id: 1, title: "Who are we?", text: one },
    { id: 2, title: "What do we want?", text: two },
    { id: 3, title: "How will we achieve it?", text: three }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 max-w-6xl mx-auto">
      {panels.map((panel) => (
        <InteractivePanel key={panel.id} panel={panel} />
      ))}
    </div>
  );
}

export default HomepageDescription;