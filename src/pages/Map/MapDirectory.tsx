import type { SchoolMarker } from "./types";

export function MapDirectory({ locations, setHovered }: { locations: SchoolMarker[], setHovered: (school: SchoolMarker | null) => void }) {
    function getDefaultColor(region: string) {
        switch (region) {
            case "Midwest":
                return "bg-purple-400 hover:bg-purple-500";
            case "Northeast":
                return "bg-blue-400 hover:bg-blue-500";
            case "Southeast":
                return "bg-yellow-400 hover:bg-yellow-500";
            case "Southwest":
                return "bg-orange-400 hover:bg-orange-500";
            case "West":
            case "West ":
                return "bg-red-400 hover:bg-red-500";
            default:
                return "bg-gray-400 hover:bg-gray-500";
        }
    }

    return (
        <div className="overflow-auto h-50">
            {locations.map((school) => (
                <a href={school.link} target="_blank" rel="noopener noreferrer" key={school.id}>
                    <div className={`font-cascadia p-2 border-b border-gray-300 ${getDefaultColor(school.region)}`} onMouseEnter={() => setHovered(school)} onMouseLeave={() => setHovered(null)}>
                        <h2 className="font-bold">{school.name}</h2>
                        <p className="text-gray-300 text-xs">{school.description}</p>
                    </div>
                </a>
            ))}
        </div>
    );
}