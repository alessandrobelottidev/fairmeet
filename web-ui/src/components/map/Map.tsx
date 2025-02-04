"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

//TO-DO: - stop the reload of the map
export default function Map({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  let map: L.Map;

  useEffect(() => {
    // Red marker variant
    const redIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    map = L.map("map").setView([latitude, longitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([latitude, longitude], { icon: redIcon })
      .addTo(map)
      .bindPopup("Red Marker");

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0, // Adjust this value based on your ActionBar height
        width: "100%",
        zIndex: 0,
      }}
    />
  );
}
