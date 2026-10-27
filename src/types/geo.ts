export type LatLon = {
  lat: number;
  lon: number;
};

/** A land dot as [latitude, longitude], generated from Natural Earth 110m. */
export type LandDot = readonly [number, number];
