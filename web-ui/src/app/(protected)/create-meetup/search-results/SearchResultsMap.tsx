"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { useMeetupCreation } from "@/context/meetup-creation-context";
import { useRouter } from "next/navigation";
import { ScoredPlace } from "@fairmeet/rest-api";
import { isValidUrl } from "@/lib/url";

const CustomIcon = (color: string) => {
  const size = 20;
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

const createRecomMapMarker = (
  coordinates: [number, number],
  color: string,
  popupContent: string,
  className?: string
) => {
  return L.marker(coordinates, {
    icon: CustomIcon(color),
  }).bindPopup(popupContent, {
    className: className,
    closeOnClick: false,
    autoClose: false,
    closeButton: false,
    autoPan: false,
  });
};

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

interface Centroid {
  lat: number;
  lng: number;
  radius: number; // in meters
}

function calculateCentroid(
  markers: { lat: number; long: number }[]
): Centroid | null {
  if (!markers.length) return null;

  // Calculate centroid
  const sumLat = markers.reduce((sum, marker) => sum + Number(marker.lat), 0);
  const sumLng = markers.reduce((sum, marker) => sum + Number(marker.long), 0);
  const centroidLat = sumLat / markers.length;
  const centroidLng = sumLng / markers.length;

  // Calculate radius that encompasses all points
  const radius = Math.max(
    ...markers.map((marker) => {
      const point = L.latLng(Number(marker.lat), Number(marker.long));
      const centroidPoint = L.latLng(centroidLat, centroidLng);
      return point.distanceTo(centroidPoint);
    })
  );

  // Add some padding to the radius (e.g., 10%)
  const paddedRadius = radius * 1.1;

  return {
    lat: centroidLat,
    lng: centroidLng,
    radius: paddedRadius,
  };
}

interface Props {
  recommendedPlaces: ScoredPlace[];
  mapRef: React.RefObject<L.Map | null>;
}

export default function SearchResultsMap({ recommendedPlaces, mapRef }: Props) {
  const mapContainerId = `map-${Math.random().toString(36).substr(2, 9)}`;
  const [centroid, setCentroid] = useState<Centroid | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const router = useRouter();

  const { updateMeetupData, meetupData } = useMeetupCreation();

  const friends = meetupData.friends ?? [];

  useEffect(() => {
    const validFriends = friends.filter((friend) => friend.lat && friend.long);

    const newCentroid = calculateCentroid(
      recommendedPlaces.map((recom) => {
        const lat = recom.place.location.coordinates[0];
        const lng = recom.place.location.coordinates[1];
        return { lat: lat, long: lng };
      })
    );
    setCentroid(newCentroid);
    updateMeetupData({
      radius: {
        lat: newCentroid?.lat,
        long: newCentroid?.lng,
        sizeInMeters: newCentroid?.radius,
      },
    });

    const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

    const container = document.getElementById(mapContainerId);
    if (!container) return;

    if (!mapRef.current) {
      const initialCenter = newCentroid || { lat: 46.068878, lng: 11.123574 };

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
        center: [initialCenter.lat, initialCenter.lng],
        zoom: 15,
      });

      mapRef.current = newMap;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "",
      }).addTo(newMap);

      // Add place markers
      const markers = validFriends.map((friend) => {
        const lat = Number(friend.lat);
        const lng = Number(friend.long);

        return createMapMarker([lat, lng], "#60a5fa", friend.user.handle).addTo(
          newMap
        );
      });

      // Add recommended events and spots markers
      const recomMarkers = recommendedPlaces.map((recom) => {
        const lat = recom.place.location.coordinates[0];
        const lng = recom.place.location.coordinates[1];

        console.log([lat, lng]);

        const urlImage = isValidUrl(recom.place.featuredImageUrl)
          ? recom.place.featuredImageUrl
          : "/placeholder.jpg";

        const popupContent = `
            <div class="flex flex-col items-center p-1">
              <div class="relative w-[50px] h-[50px] bg-gray-100 rounded-md overflow-hidden">
                <img
                  src="${urlImage}"
                  class="w-full h-full object-cover transition-opacity duration-300"
                  onerror="this.classList.add('opacity-0')"
                />
              </div>
            </div>
          `;

        return createRecomMapMarker([lat, lng], "black", popupContent)
          .addTo(newMap)
          .openPopup();
      });

      // Add circle if centroid exists
      if (newCentroid) {
        circleRef.current = L.circle([newCentroid.lat, newCentroid.lng], {
          radius: newCentroid.radius,
          color: "#3b82f6",
          fillColor: "#60a5fa",
          fillOpacity: 0.2,
          weight: 1,
        }).addTo(newMap);

        // Create initial bounds from the centroid
        const bounds = L.latLngBounds(
          [newCentroid.lat, newCentroid.lng], // southwest corner
          [newCentroid.lat, newCentroid.lng] // northeast corner
        );

        // Extend bounds to include all markers
        validFriends.forEach((friend) => {
          bounds.extend([Number(friend.lat), Number(friend.long)]);
        });

        // Extend the bounds
        recomMarkers.forEach((marker) => bounds.extend(marker.getLatLng()));

        // Fit the map to show all markers and circle with some padding
        newMap.fitBounds(bounds);
      }

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [friends, recommendedPlaces]);

  return (
    <div className="w-full h-[calc(_100vh_-_30px_)] overflow-hidden relative">
      <div id={mapContainerId} className="w-full h-full" />
    </div>
  );
}
