"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

// Define types for your data
interface Friend {
  user: {
    handle: string;
  };
  lat: number;
  long: number;
}

interface MeetupData {
  friends?: Friend[];
  userPositionToChange?: {
    handle: string;
  };
  // Add other properties as needed
}

interface MapComponentProps {
  meetupData: MeetupData;
  updateMeetupData: (data: any) => void;
  onSavePosition: (lat: number, lng: number) => void;
}

function createMapMarker(
  coordinates: [number, number],
  color: string,
  label?: string
) {
  const size = 24;
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
    </svg>
  `;

  const icon = L.divIcon({
    html: `
      ${
        label
          ? `
        <div class="bg-white px-2 py-1 rounded-lg shadow-lg text-sm font-medium">
          @${label}
        </div>
      `
          : ""
      }
      <img src="data:image/svg+xml;base64,${btoa(
        svgIcon
      )}" width="${size}" height="${size}"/>
    `,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });

  return L.marker(coordinates, { icon });
}

export default function MapClientComponent({ 
  meetupData, 
  updateMeetupData, 
  onSavePosition 
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerId = `map-${Math.random().toString(36).substr(2, 9)}`;
  const centerMarkerRef = useRef<L.Marker | null>(null);

  const friends = meetupData.friends ?? [];

  const handleGetPosition = () => {
    if (centerMarkerRef.current) {
      const position = centerMarkerRef.current.getLatLng();
      console.log("Longitude:", position.lng, "Latitude:", position.lat);
      onSavePosition(position.lat, position.lng);
    }
  };

  useEffect(() => {
    const [longitude, latitude] = [11.123574, 46.068878];

    const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

    const container = document.getElementById(mapContainerId);
    if (!container) return;

    if (!mapRef.current) {
      const newMap = L.map(container, {
        zoomControl: false,
        dragging: true,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: true,
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

      // Create center marker
      if (meetupData.userPositionToChange) {
        centerMarkerRef.current = createMapMarker(
          [newMap.getCenter().lat, newMap.getCenter().lng],
          "#ff0000",
          meetupData.userPositionToChange.handle
        ).addTo(newMap);
      }

      // Update center marker position on map move
      newMap.on("move", () => {
        if (centerMarkerRef.current && mapRef.current) {
          const center = mapRef.current.getCenter();
          centerMarkerRef.current.setLatLng(center);
        }
      });

      // Add place markers
      const markers = friends
        .filter((friend: Friend) => friend.lat && friend.long)
        .map((friend: Friend) => {
          const lat = Number(friend.lat);
          const lng = Number(friend.long);

          return createMapMarker(
            [lat, lng],
            "#60a5fa",
            friend.user.handle
          ).addTo(newMap);
        });

      // Create bounds that include circle and all markers
      const bounds = mapRef.current.getBounds();
      markers.forEach((marker: L.Marker) => bounds.extend(marker.getLatLng()));

      // Fit the map to show all markers and circle with some padding
      newMap.fitBounds(bounds.pad(0.1));

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [friends, meetupData.userPositionToChange]);

  return (
    <>
      <div id={mapContainerId} className="w-full h-full" />
      <div className="absolute z-[999] bottom-0 left-0 right-0 pt-4 pb-2 pl-4 pr-4 bg-white">
        <button
          onClick={handleGetPosition}
          className="w-full bg-black hover:bg-black text-white font-semibold py-2 px-4 rounded-full"
        >
          Imposta posizione
        </button>
      </div>
    </>
  );
}