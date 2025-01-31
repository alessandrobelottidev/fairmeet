// pages/Mappa.js
"use client";

import ActionBar from "@/components/actionbar/Actionbar";
import Link from "next/link";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

    // Green marker variant
    const greenIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Circle marker (no image needed)
    const circleMarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };

    map = L.map("map").setView([latitude, longitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([latitude, longitude], { icon: redIcon })
      .addTo(map)
      .bindPopup("Red Marker");

    // L.marker([51.51, -0.09], { icon: greenIcon })
    //   .addTo(map)
    //   .bindPopup("Green Marker");

    // L.circleMarker([51.515, -0.1], circleMarkerOptions)
    //   .addTo(map)
    //   .bindPopup("Circle Marker");

    return () => {
      map.remove();
    };
  }, []);

  // useEffect(() => {
  //   const logView = () => {
  //     const center = map.getCenter();
  //     latitude = center.lat;
  //     longitude = center.lng;
  //   };

  //   map.on("moveend", logView);
  // }, [map]);

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
function useMap() {
  throw new Error("Function not implemented.");
}
