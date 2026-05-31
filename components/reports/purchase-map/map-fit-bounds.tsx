"use client";

import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

type MapFitBoundsProps = {
  positions: [number, number][];
  boundsKey: string;
};

export function MapFitBounds({ positions, boundsKey }: MapFitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;

    const bounds = L.latLngBounds(positions);
    if (!bounds.isValid()) return;

    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [map, positions, boundsKey]);

  return null;
}
