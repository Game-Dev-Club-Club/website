import { useState } from "react";

const about = "We are the game dev club club";
const links = "Links to our social media and other stuff";
const test = "Lorem Ipsum dolor sit amet... (truncated for brevity)";

function HomepageDescription() {
  const [hovered, setHovered] = useState(0);

  const panels = [
    { id: 1, title: "Who are we?", text: about },
    { id: 2, title: "Links", text: links },
    { id: 3, title: "Test", text: test }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 max-w-6xl mx-auto">
      {panels.map((panel) => (
        <div
          key={panel.id}
          className="no-cursor clickable border-2 border-gray-200 rounded-lg py-8 px-5 min-h-[200px] flex items-center justify-center text-center bg-gray-50 cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-100 hover:border-gray-400 hover:-translate-y-1 hover:shadow-md"
          onMouseEnter={() => setHovered(panel.id)}
          onMouseLeave={() => setHovered(0)}
        >
          {hovered === panel.id ? (
            <p className="text-lg text-gray-600 leading-relaxed">
              {panel.text}
            </p>
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800">
              {panel.title}
            </h2>
          )}
        </div>
      ))}
    </div>
  );
}

export default HomepageDescription;