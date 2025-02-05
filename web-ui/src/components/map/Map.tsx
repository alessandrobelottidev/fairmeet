"use client";

import { useEffect, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { MeetUpContext } from "@/app/(protected)/organize-meetup/context";
import { ScoredPlace } from "@fairmeet/rest-api";
import redMarkerIcon from "@/assets/markers/red-marker.png";
import greenMarkerIcon from "@/assets/markers/green-marker.png";

export default function Map({
  coordinates,
  recommendations,
}: {
  coordinates: number[];
  recommendations: ScoredPlace[];
}) {
  let map: L.Map;
  // Custom markers using local assets
  const redIcon = L.icon({
    iconUrl: redMarkerIcon.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const greenIcon = L.icon({
    iconUrl: greenMarkerIcon.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    const [latitude, longitude] = coordinates;

    // Define world bounds (around coordinates 0,0)
    const worldBounds = L.latLngBounds(
      L.latLng(-90, -180), // Southwest corner
      L.latLng(90, 180) // Northeast corner
    );

    map = L.map("map", {
      zoomControl: false,
      minZoom: 2,
      maxZoom: 18,
      maxBounds: worldBounds, // Set the maximum bounds to world bounds
      maxBoundsViscosity: 1.0, // Make the bounds completely solid
      bounceAtZoomLimits: false, // Prevent bouncing at zoom limits
      keyboardPanDelta: 100, // Adjust keyboard pan speed
      center: [latitude, longitude], // Initial center at provided coordinates
      zoom: 15, // Initial zoom level
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add markers
    L.marker([latitude, longitude], { icon: redIcon }).addTo(map);

    recommendations.forEach((event) => {
      const lat = event.place.location.coordinates[0];
      const lng = event.place.location.coordinates[1];
      L.marker([lat, lng], { icon: greenIcon }).addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [coordinates, recommendations]);

  return (
    <div
      id="map"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        zIndex: 0,
      }}
    />
  );
}
