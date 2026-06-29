import { useEffect, useRef } from "react";

function HomepageFace() {
  const textRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLHeadingElement>(null);

  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const baseRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const highlightRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const radius = 60;
  const strength = 0.12;
  const push = 5;
  const lerp = 0.15;

  const lines = [
    "Game Dev",
    "Club Club",
  ];

  useEffect(() => {
    let frame: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return;

      const rect = textRef.current.getBoundingClientRect();

      targetPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const animate = () => {
      currentPos.current.x +=
        (targetPos.current.x - currentPos.current.x) * lerp;

      currentPos.current.y +=
        (targetPos.current.y - currentPos.current.y) * lerp;

      if (highlightRef.current) {
        highlightRef.current.style.clipPath =
          `circle(35px at ${currentPos.current.x}px ${currentPos.current.y}px)`;
      }

      const parentRect = textRef.current?.getBoundingClientRect();

      if (parentRect) {
        for (let i = 0; i < baseRefs.current.length; i++) {
          const base = baseRefs.current[i];
          const highlight = highlightRefs.current[i];

          if (!base || !highlight) continue;

          const rect = base.getBoundingClientRect();

          const cx = rect.left - parentRect.left + rect.width / 2;
          const cy = rect.top - parentRect.top + rect.height / 2;

          const dx = cx - currentPos.current.x;
          const dy = cy - currentPos.current.y;

          const dist = Math.sqrt(dx * dx + dy * dy);

          const influence = Math.exp(
            -(dist * dist) / (radius * radius)
          );

          const scale = 1 + influence * strength;

          const len = Math.max(dist, 1);

          const tx = (dx / len) * influence * push;
          const ty = (dy / len) * influence * push;

          const transform =
            `translate(${tx}px, ${ty}px) scale(${scale})`;

          base.style.transform = transform;
          highlight.style.transform = transform;
        }
      }

      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  function renderLayer(
    refs: React.MutableRefObject<(HTMLSpanElement | null)[]>
  ) {
    let index = 0;

    return lines.map((line, lineIndex) => (
      <div key={lineIndex}>
        {line.split("").map((char) => {
          const current = index++;

          return (
            <span
              key={current}
              ref={(el) => {
                refs.current[current] = el;
              }}
              style={{
                display: "inline-block",
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
    ));
  }

  return (
    <div>
      <h1 className="text-3xl font-capriola text-[var(--blackberry)] leading-[1.3]">
        Hi! We are the
      </h1>

      <div
        ref={textRef}
        className="relative inline-block"
      >
        {/* Added drop-shadow-lg here! */}
        <h1 className="text-6xl select-none font-hiruko text-[var(--blackberry)] leading-[1.3] drop-shadow-lg">
          {renderLayer(baseRefs)}
        </h1>

        <h1
          ref={highlightRef}
          className="absolute inset-0 pointer-events-none select-none text-6xl font-hiruko text-[var(--strawberry1)] leading-[1.3]"
          style={{
            clipPath: "circle(0px at 0px 0px)",
          }}
        >
          {renderLayer(highlightRefs)}
        </h1>
      </div>

      <h2 className="mt-6 text-2xl font-cascadia text-[var(--grape)] leading-[1.3]">
        A club for game dev clubs.
      </h2>
    </div>
  );
}

export default HomepageFace;