import L from "leaflet";

const CustomMarker = (color: string) => {
  const size = 32;
  const stroke = "white";
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="${stroke}" stroke-width="2"/>
    </svg>
  `;

  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const MapMarker = (
  coordinates: [number, number],
  color: string,
  popupContent: string,
  className?: string
) => {
  return L.marker(coordinates, {
    icon: CustomMarker(color),
  }).bindPopup(popupContent, {
    className: className,
    closeOnClick: false,
    autoClose: false,
    closeButton: false,
    autoPan: false,
  });
};

export default MapMarker;
