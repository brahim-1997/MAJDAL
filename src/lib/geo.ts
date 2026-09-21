/**
 * Projection for THE REGISTER.
 *
 * Equirectangular, scaled by cos(latitude) so the shape is not stretched at
 * this latitude band. No projection library: we are placing a few dozen labels
 * in a fixed viewBox, not rendering a globe.
 */

import { places, type Place } from "@/content/places";

export const VIEW = { w: 760, h: 1180 } as const;

/** Padding inside the viewBox so labels never touch the edge. */
const PAD = { x: 150, y: 110 } as const;

const lats = places.map((p) => p.coordinates.lat);
const lons = places.map((p) => p.coordinates.lon);

const bounds = {
  minLat: Math.min(...lats),
  maxLat: Math.max(...lats),
  minLon: Math.min(...lons),
  maxLon: Math.max(...lons),
};

/** Mean latitude of the set, for the longitude correction. */
const meanLat = (bounds.minLat + bounds.maxLat) / 2;
const lonScale = Math.cos((meanLat * Math.PI) / 180);

const spanLat = bounds.maxLat - bounds.minLat || 1;
const spanLon = (bounds.maxLon - bounds.minLon) * lonScale || 1;

export type Projected = { x: number; y: number };

export function project(lat: number, lon: number): Projected {
  const usableW = VIEW.w - PAD.x * 2;
  const usableH = VIEW.h - PAD.y * 2;

  // Preserve aspect: fit the wider span and centre the other axis.
  const scale = Math.min(usableW / spanLon, usableH / spanLat);

  const cx = (bounds.minLon + bounds.maxLon) / 2;
  const cy = (bounds.minLat + bounds.maxLat) / 2;

  return {
    x: VIEW.w / 2 + (lon - cx) * lonScale * scale,
    // SVG y grows downward; latitude grows upward.
    y: VIEW.h / 2 - (lat - cy) * scale,
  };
}

export type PlacedPlace = Place & Projected;

export function placed(): PlacedPlace[] {
  return places.map((p) => ({
    ...p,
    ...project(p.coordinates.lat, p.coordinates.lon),
  }));
}

/** Coordinates formatted for the record register. Precision stated, not implied. */
export function formatCoordinates(p: Place): string {
  const { lat, lon, precision } = p.coordinates;
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  const figure = `${Math.abs(lat).toFixed(2)}° ${ns}  ${Math.abs(lon).toFixed(2)}° ${ew}`;
  return precision === "approximate" ? `${figure} · approx.` : figure;
}
