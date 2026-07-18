import { useLocation, useNavigate } from "react-router-dom";

const PAGE_ORDER = ["/", "/contact-us", "/map", "/jam"] as const;

const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/contact-us": "Contact Us",
  "/map": "Map",
  "/jam": "Jam",
};

export default function NavigationArrows() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = PAGE_ORDER.indexOf(location.pathname as typeof PAGE_ORDER[number]);

  if (currentIndex === -1) return null;

  const prevPath = currentIndex > 0 ? PAGE_ORDER[currentIndex - 1] : undefined;
  const nextPath =
    currentIndex < PAGE_ORDER.length - 1
      ? PAGE_ORDER[currentIndex + 1]
      : undefined;

  const goPrev = () => {
    if (prevPath) navigate(prevPath);
  };

  const goNext = () => {
    if (nextPath) navigate(nextPath);
  };

  return (
    <div>
      {prevPath && (
        <button
          onClick={goPrev}
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-[calc(1.5rem+env(safe-area-inset-left))] z-40 p-3 flex items-center gap-2 text-black rounded-full transition-transform hover:-translate-x-1 cursor-pointer"
          aria-label="Previous Page"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>

          <span className="font-cascadia retro-pixel-text">
            {PAGE_NAMES[prevPath]}
          </span>
        </button>
      )}

      {nextPath && (
        <button
          onClick={goNext}
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-40 p-3 flex items-center gap-2 text-black rounded-full transition-transform hover:translate-x-1 cursor-pointer"
          aria-label="Next Page"
        >
          <span className="font-cascadia retro-pixel-text">
            {PAGE_NAMES[nextPath]}
          </span>

          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}