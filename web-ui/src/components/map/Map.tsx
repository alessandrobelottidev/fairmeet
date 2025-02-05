"use client";

import { useEffect, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { MeetUpContext } from "@/app/(protected)/organize-meetup/context";
import { ScoredPlace } from "@fairmeet/rest-api";
import CustomMarker from "./CustomMarker";
import { isValidUrl } from "@/lib/url";

export default function Map({
  coordinates,
  recommendations,
}: {
  coordinates: number[];
  recommendations: ScoredPlace[];
}) {
  let map: L.Map;

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

    // User marker
    L.marker([latitude, longitude], { icon: CustomMarker("green") })
      .addTo(map)
      .bindPopup("@you", {
        className: "bg-white rounded-lg shadow-lg overflow-hidden",
        closeOnClick: false,
        autoClose: false,
        closeButton: false,
      });

    // Events and spots marker
    recommendations.forEach((event) => {
      const lat = event.place.location.coordinates[0];
      const lng = event.place.location.coordinates[1];

      var urlImage;

      if (isValidUrl(event.place.featuredImageUrl)) {
        urlImage = event.place.featuredImageUrl;
      } else {
        urlImage = "/placeholder.jpg";
      }

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

      L.marker([lat, lng], { icon: CustomMarker("black") })
        .addTo(map)
        .bindPopup(popupContent, {
          // className: "bg-white rounded-lg shadow-lg overflow-hidden",
          closeOnClick: false,
          autoClose: false,
          closeButton: false,
        })
        .openPopup();
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
