import type { SchoolMarker } from "./types";
import { getRegionClasses } from "./regionColors";

//most of the color logic got shifted to regionColors.ts
export function MapDirectory({ locations, setHovered }: { locations: SchoolMarker[], setHovered: (school: SchoolMarker | null) => void }) {
    return (
        <>
            {locations.map((school) => (
                <a href={school.link} target="_blank" rel="noopener noreferrer" key={school.id}>
                    <div className={`font-cascadia p-2 border-b border-gray-300 ${getRegionClasses(school.region).directory}`} onMouseEnter={() => setHovered(school)} onMouseLeave={() => setHovered(null)}>
                        <h2 className="font-bold">{school.name}</h2>
                        <p className="text-gray-700 text-xs">{school.description}</p>
                    </div>
                </a>
            ))}
        </>
    );
}
