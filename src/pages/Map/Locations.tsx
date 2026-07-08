import { useEffect, useState } from "react";
import Papa from "papaparse";
import csvFile from "../../assets/Schools List - Main.csv?url";
import coordsCsvFile from "../../assets/college_coordinates.csv?url"; 

type Row = {
  Region: string;
  School: string;
  "Club Name": string;
  "Club Info / Links": string;
  "Main Contact (Discord)": string;
  Status: string;
  coordinates: [number, number];
};

type CoordRow = {
  INSTNM: string;
  LATITUDE: string;
  LONGITUDE: string;
};

const hardcodedCoords: Record<string, [number, number]> = {
  "university of pennsylvania": [-75.1932, 39.9526],
  "stanford": [-122.1661, 37.4241],
};

export function useSchools() {
  const [data, setData] = useState<Row[]>([]);

  useEffect(() => {
    // Fetch both CSV files at the same time
    Promise.all([
      fetch(csvFile).then((res) => res.text()),
      fetch(coordsCsvFile).then((res) => res.text()),
    ]).then(([mainText, coordsText]) => {
      
      // 1. Parse the coordinates CSV
      const coordsResult = Papa.parse<CoordRow>(coordsText, {
        header: true,
        skipEmptyLines: true,
      });

      // 2. Build a case-insensitive lookup dictionary
      const coordMap = new Map<string, [number, number]>();
      
      // Load fallbacks first (lowercase)
      Object.entries(hardcodedCoords).forEach(([key, val]) => {
        coordMap.set(key.toLowerCase(), val);
      });

      // Populate map with CSV data
      coordsResult.data.forEach((row) => {
        if (row.INSTNM && row.LATITUDE && row.LONGITUDE) {
          // Normalize the name: lowercase and strip extra whitespace
          const normalizedName = row.INSTNM.toLowerCase().trim();
          const lat = parseFloat(row.LATITUDE);
          const lon = parseFloat(row.LONGITUDE);
          
          if (!isNaN(lat) && !isNaN(lon)) {
            // react-simple-maps REQUIRES [longitude, latitude] order!
            coordMap.set(normalizedName, [lon, lat]);
          }
        }
      });

      // 3. Parse your main list
      const mainResult = Papa.parse<Omit<Row, "coordinates">>(mainText, {
        header: true,
        skipEmptyLines: true,
      });

      // 4. Merge them together
      const mergedData = mainResult.data.map((row) => {
        const searchName = (row.School || "").toLowerCase().trim();
        return {
          ...row,
          coordinates: coordMap.get(searchName) ?? [0, 0],
        };
      }) as Row[];

      setData(mergedData);
    });
  }, []);

  return data;
}

