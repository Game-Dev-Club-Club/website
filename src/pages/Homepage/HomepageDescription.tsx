import { useEffect, useRef } from "react";

const about = "We are the game dev club club";
const links = "Links to our social media and other stuff";
const test = "Lorem Ipsum dolor sit amet... (truncated for brevity)";

function InteractivePanel({ panel }) {
  const containerRef = useRef(null);
  const revealRef = useRef(null);

  // We track x, y, and r (radius)
  const target = useRef({ x: 0, y: 0, r: 0 });
  const current = useRef({ x: 0, y: 0, r: 0 });

const animate = () => {
      // 1. Keep the mouse position tracking responsive with Lerp
      const posLerp = 0.1; 
      current.current.x += (target.current.x - current.current.x) * posLerp;
      current.current.y += (target.current.y - current.current.y) * posLerp;

      // 2. Use a CONSTANT speed for the radius so it doesn't explode outward
      const growSpeed = 12;   // Tweak this! Lower = slower expansion
      const shrinkSpeed = 40; // Tweak this! Higher = faster snap back

      if (target.current.r > 0) {
        // We are hovering (Growing)
        current.current.r += growSpeed;
        if (current.current.r > target.current.r) {
           current.current.r = target.current.r;
        }
      } else {
        // We left the box (Shrinking)
        current.current.r -= shrinkSpeed;
        if (current.current.r < 0) {
           current.current.r = 0;
        }
      }

      // Apply the expanding/moving clipping mask
      if (revealRef.current) {
        revealRef.current.style.clipPath = 
          `circle(${current.current.r}px at ${current.current.x}px ${current.current.y}px)`;
      }

      frame = requestAnimationFrame(animate);
    };

  useEffect(() => {
    let frame;
    
    const animate = () => {
      // 1. Keep the mouse position tracking responsive
      const posLerp = 0.1; 
      
      // 2. Make the radius expansion much slower (0.03) than the shrinking (0.15)
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

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    target.current.x = e.clientX - rect.left;
    target.current.y = e.clientY - rect.top;
  };

  const handleMouseEnter = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Instantly snap the starting circle to the mouse position 
    // so it doesn't fly in from the top left corner (0,0)
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    current.current.x = startX;
    current.current.y = startY;
    target.current.x = startX;
    target.current.y = startY;
    
    // Set target radius large enough to cover the whole box
    target.current.r = 800; 
  };

  const handleMouseLeave = () => {
    // Shrink the circle back to nothing
    target.current.r = 0;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden no-cursor clickable rounded-lg min-h-[150px] flex items-center justify-center text-center bg-(--ripe) transition-transform duration-200 ease-in-out odd:-rotate-2 even:rotate-2 hover:-translate-y-1 hover:shadow-md hover:rotate-0"
    >
      {/* Base Layer (Title) */}
      <h2 className="text-2xl font-bebas text-(--blueberry) px-5 py-8">
        {panel.title}
      </h2>

      {/* Reveal Layer (Expands on Hover) */}
      <div
        ref={revealRef}
        className="absolute inset-0 flex items-center justify-center text-center bg-(--pale) px-5 py-8 z-10 pointer-events-none"
        style={{ clipPath: "circle(0px at 0px 0px)" }}
      >
        <p className="text-lg font-bebas text-(--blueberry) leading-relaxed">
          {panel.text}
        </p>
      </div>
    </div>
  );
}

function HomepageDescription() {
  const panels = [
    { id: 1, title: "Who are we?", text: about },
    { id: 2, title: "Links", text: links },
    { id: 3, title: "Test", text: test }
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