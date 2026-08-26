export function getRegionClasses(region: string) {
    switch (region) {
        case "Midwest":
            return {
                directory: "bg-purple-400 hover:bg-purple-500",
                fill: "fill-purple-400",
            };
        case "Northeast":
            return {
                directory: "bg-blue-400 hover:bg-blue-500",
                fill: "fill-blue-400",
            };
        case "Southeast":
            return {
                directory: "bg-yellow-400 hover:bg-yellow-500",
                fill: "fill-yellow-400",
            };
        case "Southwest":
            return {
                directory: "bg-orange-400 hover:bg-orange-500",
                fill: "fill-orange-400",
            };
        case "West":
        case "West ":
            return {
                directory: "bg-red-400 hover:bg-red-500",
                fill: "fill-red-400",
            };
        default:
            return {
                directory: "bg-gray-400 hover:bg-gray-500",
                fill: "fill-gray-400",
            };
    }
}
