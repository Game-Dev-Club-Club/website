import type { SchoolMarker } from "./types";

export function MapDirectory({ locations, setHovered }: { locations: SchoolMarker[], setHovered: (school: SchoolMarker | null) => void }) {

    return (
        <div className="overflow-auto h-200 ">
            {locations.map((school) => <div className="font-cascadia p-2 border-b border-gray-300 bg-red-500 hover:bg-red-400" onMouseEnter={() => setHovered(school)} onMouseLeave={() => setHovered(null)} key={school.id}>
                <a href={school.link} target="_blank" rel="noopener noreferrer">{school.name}</a>
                <p className="text-gray-300 text-xs">{school.description}</p>
            </div>)}
        </div>
    );
}