"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { useMeetupCreation } from "@/context/meetup-creation-context";
import { useRouter } from "next/navigation";

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

export default function ParticipantsMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerId = `map-${Math.random().toString(36).substr(2, 9)}`;
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const router = useRouter();

  const { updateMeetupData, meetupData } = useMeetupCreation();

  const friends = meetupData.friends ?? [];

  const handleGetPosition = () => {
    if (centerMarkerRef.current) {
      const position = centerMarkerRef.current.getLatLng();
      console.log("Longitude:", position.lng, "Latitude:", position.lat);

      if (meetupData.userPositionToChange && meetupData.friends) {
        const temp = meetupData.friends;

        temp.forEach((friend) => {
          if (friend.user.handle === meetupData.userPositionToChange?.handle) {
            friend.lat = position.lat;
            friend.long = position.lng;
          }
        });

        updateMeetupData({ friends: temp });
        router.back();
      }
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
        .filter((friend) => friend.lat && friend.long)
        .map((friend) => {
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
  }, [friends]);

  return (
    <div className="w-full h-[calc(_100vh_-_30px_)] overflow-hidden relative">
      <div id={mapContainerId} className="w-full h-full" />
      <div className="absolute z-[999] bottom-0 left-0 right-0 pt-4 pb-2 pl-4 pr-4 bg-white">
        <button
          onClick={handleGetPosition}
          className="w-full bg-black hover:bg-black text-white font-semibold py-2 px-4 rounded-full"
        >
          Imposta posizione
        </button>
      </div>
    </div>
  );
}
