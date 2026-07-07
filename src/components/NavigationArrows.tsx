import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// The exact order of your pages
const PAGE_ORDER = ['/', '/contact-us', '/map', '/jam'];

// Map the paths to readable names for the buttons
const PAGE_NAMES = {
  '/': 'Home',
  '/contact-us': 'Contact Us',
  '/map': 'Map',
  '/jam': 'Jam'
};

export default function NavigationArrows() {
  const location = useLocation();
  const navigate = useNavigate();

  // Find where we currently are in the array
  const currentIndex = PAGE_ORDER.indexOf(location.pathname);

  // If the user is on a route that isn't in the array (like a 404), don't show arrows
  if (currentIndex === -1) return null;

  // Determine if we have a previous or next page
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < PAGE_ORDER.length - 1;

  const prevPath = hasPrev ? PAGE_ORDER[currentIndex - 1] : null;
  const nextPath = hasNext ? PAGE_ORDER[currentIndex + 1] : null;

  const goPrev = () => navigate(prevPath);
  const goNext = () => navigate(nextPath);

  return (
    <>
      {/* LEFT ARROW */}
      {hasPrev && (
        <button
          onClick={goPrev}
          className="fixed bottom-6 left-6 z-40 p-3 flex items-center gap-2 text-black rounded-full transition-transform hover:-translate-x-1 cursor-pointer"
          aria-label="Previous Page"
        >
          {/* Left */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-cascadia retro-pixel-text">{PAGE_NAMES[prevPath]}</span>
        </button>
      )}

      {/* RIGHT ARROW */}
      {hasNext && (
        <button
          onClick={goNext}
          className="fixed bottom-6 right-6 z-40 p-3 flex items-center gap-2 text-black rounded-full transition-transform hover:translate-x-1 cursor-pointer"
          aria-label="Next Page"
        >
          <span className="font-cascadia retro-pixel-text">{PAGE_NAMES[nextPath]}</span>
          {/* Right */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </>
  );
}