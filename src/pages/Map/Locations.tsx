type Location = {
  id: number;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
};

const locations: Location[] = [
  {
    id: 1,
    name: "Philadelphia",
    coordinates: [-75.1652, 39.9526],
    description: "UPenn Game Development Club",
  },
  {
    id: 2,
    name: "San Francisco",
    coordinates: [-122.4194, 37.7749],
    description: "Duckbeanpotato HQ",
  },
];

export default locations;