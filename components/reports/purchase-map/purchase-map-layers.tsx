"use client";

import { Fragment } from "react";
import { Marker, Polyline, Popup, Tooltip } from "react-leaflet";
import { Badge } from "@/components/ui/badge";
import { formatCad } from "@/lib/format/currency";
import { getEmployeeColor } from "@/lib/map/colors";
import { createColoredPinIcon } from "@/lib/map/icons";
import type { MapEmployeePurchases } from "@/lib/types/map";

type PurchaseMapLayersProps = {
  employees: MapEmployeePurchases[];
  colorIndex: Map<string, number>;
};

export function PurchaseMapLayers({
  employees,
  colorIndex,
}: PurchaseMapLayersProps) {
  return (
    <>
      {employees.map((emp) => {
        const idx = colorIndex.get(emp.employee_id) ?? 0;
        const color = getEmployeeColor(idx);
        const icon = createColoredPinIcon(color);

        return (
          <Fragment key={emp.employee_id}>
            {emp.segments.map((seg) => (
              <Polyline
                key={`${seg.from.transaction_id}-${seg.to.transaction_id}`}
                positions={[
                  [seg.from.lat, seg.from.lng],
                  [seg.to.lat, seg.to.lng],
                ]}
                pathOptions={{
                  color,
                  weight: 3,
                  opacity: 0.65,
                  dashArray: "8 6",
                }}
              />
            ))}
            {emp.points.map((point) => (
              <Marker
                key={point.transaction_id}
                position={[point.lat, point.lng]}
                icon={icon}
              >
                <Tooltip>
                  {point.merchant_name} · {formatCad(point.amount)}
                </Tooltip>
                <Popup>
                  <div className="min-w-[180px] space-y-1.5 text-sm">
                    <p className="font-medium">{point.merchant_name}</p>
                    <p className="text-muted-foreground">{point.city}</p>
                    <p>{formatCad(point.amount)}</p>
                    <p className="text-muted-foreground">{point.date}</p>
                    <p className="text-xs text-muted-foreground">
                      {point.merchant_category}
                    </p>
                    {point.flag_count > 0 && (
                      <Badge variant="destructive" className="mt-1">
                        Flagged ({point.flag_count})
                      </Badge>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}
