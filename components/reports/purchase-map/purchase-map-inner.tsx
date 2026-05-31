"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { MapFitBounds } from "@/components/reports/purchase-map/map-fit-bounds";
import { PurchaseMapLayers } from "@/components/reports/purchase-map/purchase-map-layers";
import type { MapEmployeePurchases } from "@/lib/types/map";

const DEFAULT_CENTER: [number, number] = [56, -96];
const DEFAULT_ZOOM = 4;

type PurchaseMapInnerProps = {
  employees: MapEmployeePurchases[];
  colorIndex: Map<string, number>;
  boundsKey: string;
};

export default function PurchaseMapInner({
  employees,
  colorIndex,
  boundsKey,
}: PurchaseMapInnerProps) {
  const positions: [number, number][] = [];
  for (const emp of employees) {
    for (const p of emp.points) {
      if (Number.isFinite(p.lat) && Number.isFinite(p.lng)) {
        positions.push([p.lat, p.lng]);
      }
    }
  }

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFitBounds positions={positions} boundsKey={boundsKey} />
      <PurchaseMapLayers employees={employees} colorIndex={colorIndex} />
    </MapContainer>
  );
}
