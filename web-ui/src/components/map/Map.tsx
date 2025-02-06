"use client";

import { useEffect, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { ScoredPlace } from "@fairmeet/rest-api";
import CustomMarker from "./CustomMarker";
import { isValidUrl } from "@/lib/url";

export default function Map({
  coordinates,
  recommendations,
  mapRef,
}: {
  coordinates: number[];
  recommendations: ScoredPlace[];
  mapRef: React.RefObject<L.Map | null>;
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

      // User marker
      const userMarker = L.marker([latitude, longitude], {
        icon: CustomMarker("green"),
      })
        .addTo(newMap)
        .bindPopup("@you", {
          className: "bg-white rounded-lg shadow-lg overflow-hidden",
          closeOnClick: false,
          autoClose: false,
          closeButton: false,
        });

      // Events and spots markers
      const markers = recommendations.map((event) => {
        const lat = event.place.location.coordinates[0];
        const lng = event.place.location.coordinates[1];

        const urlImage = isValidUrl(event.place.featuredImageUrl)
          ? event.place.featuredImageUrl
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

        return L.marker([lat, lng], { icon: CustomMarker("black") })
          .addTo(newMap)
          .bindPopup(popupContent, {
            closeOnClick: false,
            autoClose: false,
            closeButton: false,
          })
          .openPopup();
      });

      // Clean up function
      return () => {
        if (mapRef.current) {
          markers.forEach((marker) => marker.remove());
          userMarker.remove();
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
