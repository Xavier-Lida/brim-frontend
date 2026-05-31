import L from "leaflet";

export function createColoredPinIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "purchase-map-pin",
    html: `<span style="
      display: block;
      width: 22px;
      height: 22px;
      background-color: ${color};
      border: 2px solid #fff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    "></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });
}
