import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  const [hoveringClickable, setHoveringClickable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // detect mobile / touch device — kept live (not just checked once on
    // mount) so resizing across the breakpoint can't leave the native
    // cursor hidden (by CSS) with no custom cursor mounted to replace it.
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const widthQuery = window.matchMedia("(max-width: 768px)");

    const updateIsMobile = () => {
      setIsMobile(coarseQuery.matches || widthQuery.matches);
    };

    updateIsMobile();

    coarseQuery.addEventListener("change", updateIsMobile);
    widthQuery.addEventListener("change", updateIsMobile);
    return () => {
      coarseQuery.removeEventListener("change", updateIsMobile);
      widthQuery.removeEventListener("change", updateIsMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const updateMousePosition = (e: MouseEvent) => {
      const x = e.clientX - 16;
      const y = e.clientY - 16;

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate3d(${x}px, ${y}px, 0)`;
      }

      const target = e.target as HTMLElement | null;

      const isClickable = !!target?.closest(
        "a, button, input, textarea, select, summary, label, [role='button'], [onclick], .clickable"
      );

      if (isClickable !== hoveringRef.current) {
        hoveringRef.current = isClickable;
        setHoveringClickable(isClickable);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border-2 transition-colors duration-150 ease-out ${
        hoveringClickable
          ? "border-black bg-black/50"
          : "border-black bg-white/20"
      }`}
    />
  );
}