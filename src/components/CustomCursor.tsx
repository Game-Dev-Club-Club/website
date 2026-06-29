import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoveringClickable, setHoveringClickable] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - 16,
        y: e.clientY - 16,
      });

      const target = e.target as HTMLElement | null;

      setHoveringClickable(
        !!target?.closest(
          "a, button, input, textarea, select, summary, label, [role='button'], [onclick], .clickable"
        )
      );
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border-2 transition-all duration-150 ease-out ${
        hoveringClickable
          ? "border-black bg-black/50"
          : "border-black bg-white/20"
      }`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    />
  );
}