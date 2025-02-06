"use client";

import { useEffect, useContext } from "react";
import L, { marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { ScoredPlace } from "@fairmeet/rest-api";

export default function Map({
  coordinates,
  recommendations,
  mapRef,
  markers,
}: {
  coordinates: number[];
  recommendations: ScoredPlace[];
  mapRef: React.RefObject<L.Map | null>;
  markers: L.Marker[];
}) {
  useEffect(() => {
    const [latitude, longitude] = coordinates;

    // Define world bounds (around coordinates 0,0)
    const worldBounds = L.latLngBounds(
      L.latLng(-90, -180), // Southwest corner
      L.latLng(90, 180) // Northeast corner
    );

    // Check if map container exists
    const container = document.getElementById("map");
    if (!container) return;

    // Initialize map only if it doesn't exist
    if (!mapRef.current) {
      const newMap = L.map(container, {
        zoomControl: false,
        minZoom: 2,
        maxZoom: 18,
        maxBounds: worldBounds,
        maxBoundsViscosity: 1.0,
        bounceAtZoomLimits: false,
        keyboardPanDelta: 100,
        center: [latitude, longitude],
        zoom: 15,
      });

      // Store map reference
      mapRef.current = newMap;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(newMap);

      //Add markers
      markers.map((marker) => {
        marker.addTo(newMap).openPopup();
      });

      // Clean up function
      return () => {
        if (mapRef.current) {
          // markers.forEach((marker) => marker.remove());
          // userMarker.remove();
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [coordinates, recommendations]);

  return (
    <div className="sm:w-full sm:h-full sm:relative">
      <div
        id="map"
        className="fixed sm:absolute top-0 left-0 right-0 bottom-0 w-full z-0"
      />
    </div>
  );
}
