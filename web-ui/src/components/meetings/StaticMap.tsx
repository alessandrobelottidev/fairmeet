"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

interface Place {
  _id: string;
  title: string;
  placeType: "spot" | "event";
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface StaticMapProps {
  radius: {
    center: {
      type: "Point";
      coordinates: [number, number];
    };
    sizeInMeters: number;
  };
  places: Place[];
}

function createMapMarker(coordinates: [number, number], color: string) {
  const size = 24;
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
    </svg>
  `;

  return L.marker(coordinates, {
    icon: L.icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
    }),
  });
}

export default function StaticMap({ radius, places }: StaticMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerId = `map-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const [longitude, latitude] = radius.center.coordinates;

    const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

    const container = document.getElementById(mapContainerId);
    if (!container) return;

    if (!mapRef.current) {
      const newMap = L.map(container, {
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
        minZoom: 2,
        maxZoom: 18,
        maxBounds: worldBounds,
        maxBoundsViscosity: 1.0,
        bounceAtZoomLimits: false,
        center: [latitude, longitude],
        zoom: 15,
      });

      mapRef.current = newMap;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "",
      }).addTo(newMap);

      // Add radius circle
      const circle = L.circle([latitude, longitude], {
        radius: radius.sizeInMeters,
        color: "#3b82f6",
        fillColor: "#60a5fa",
        fillOpacity: 0.2,
        weight: 1,
      }).addTo(newMap);

      // Add center marker
      createMapMarker([latitude, longitude], "#3b82f6").addTo(newMap);

      // Add place markers
      const markers = places
        .filter((place) => place.location && place.location.coordinates)
        .map((place) => {
          const [lat, lng] = place.location.coordinates;
          return createMapMarker(
            [lat, lng],
            place.placeType === "event" ? "#f97316" : "#84cc16"
          ).addTo(newMap);
        });

      // Create bounds that include circle and all markers
      const bounds = circle.getBounds();
      markers.forEach((marker) => bounds.extend(marker.getLatLng()));

      // Fit the map to show all markers and circle with some padding
      newMap.fitBounds(bounds.pad(0.1));

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [radius, places]);

  return (
    <div className="w-full h-48 rounded-lg overflow-hidden shadow-sm">
      <div id={mapContainerId} className="w-full h-full" />
    </div>
  );
}
