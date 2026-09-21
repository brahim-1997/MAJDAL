/**
 * Projection for THE REGISTER.
 *
 * Equirectangular, scaled by cos(latitude) so the shape is not stretched at
 * this latitude band. No projection library: we are placing a few dozen labels
 * in a fixed viewBox, not rendering a globe.
 */

import { places, type Place } from "@/content/places";

export const VIEW = { w: 760, h: 1260 } as const;

/**
 * Fixed geographic frame for the sheet. Deliberately a constant rather than
 * derived from the places, so adding a place never reframes the map and the
 * coastline stays registered to it.
 */
export const BBOX = {
  minLat: 31.2,
  maxLat: 33.3,
  minLon: 34.2,
  maxLon: 35.7,
} as const;

const PAD = { x: 40, y: 40 } as const;

const meanLat = (BBOX.minLat + BBOX.maxLat) / 2;
const lonScale = Math.cos((meanLat * Math.PI) / 180);

const spanLat = BBOX.maxLat - BBOX.minLat;
const spanLon = (BBOX.maxLon - BBOX.minLon) * lonScale;

export type Projected = { x: number; y: number };

export function project(lat: number, lon: number): Projected {
  const usableW = VIEW.w - PAD.x * 2;
  const usableH = VIEW.h - PAD.y * 2;
  const scale = Math.min(usableW / spanLon, usableH / spanLat);

  const cx = (BBOX.minLon + BBOX.maxLon) / 2;
  const cy = (BBOX.minLat + BBOX.maxLat) / 2;

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
