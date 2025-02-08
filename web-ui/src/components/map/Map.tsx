"use client";
import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

export default function MapComponent({
  userCoordinates,
  mapRef,
  markers,
  updateView,
}: {
  userCoordinates: number[];
  mapRef: React.RefObject<L.Map | null>;
  markers: L.Marker[];
  updateView: (coordinate: [number, number]) => void;
}) {
  const lastCenter = useRef<L.LatLng | null>(null);
  const isMapInitialized = useRef(false);
  const currentMarkersRef = useRef<Map<string, L.Marker>>(new Map());

  const handleMoveEnd = useCallback(() => {
    if (!mapRef.current) return;

    const newCenter = mapRef.current.getCenter();

    if (!lastCenter.current || !newCenter.equals(lastCenter.current)) {
      lastCenter.current = newCenter;
      updateView([newCenter.lat, newCenter.lng]);
    }
  }, [updateView]);

  // Initialize map and set up event listener only once
  useEffect(() => {
    const [latitude, longitude] = userCoordinates;

    // Check if map container exists
    const container = document.getElementById("map");
    if (!container || isMapInitialized.current) return;

    const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

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

    mapRef.current = newMap;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap);

    newMap.on("moveend", handleMoveEnd);

    isMapInitialized.current = true;

    return () => {
      if (mapRef.current) {
        mapRef.current.off("moveend", handleMoveEnd);
        mapRef.current.remove();
        mapRef.current = null;
        isMapInitialized.current = false;
        currentMarkersRef.current.clear();
      }
    };
  }, [userCoordinates]);

  // Optimized marker updates
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const bounds = map.getBounds();
    const newMarkersMap = new Map<string, L.Marker>();

    // Helper to get marker identifier
    const getMarkerKey = (marker: L.Marker) => {
      const pos = marker.getLatLng();
      return `${pos.lat}-${pos.lng}`;
    };

    // Process new markers
    markers.forEach((marker) => {
      const key = getMarkerKey(marker);
      const pos = marker.getLatLng();

      // If marker already exists and is in bounds, keep it
      const existingMarker = currentMarkersRef.current.get(key);
      if (existingMarker) {
        newMarkersMap.set(key, existingMarker);
        currentMarkersRef.current.delete(key);
      } else {
        // Add new marker only if it's in bounds
        if (bounds.contains(pos)) {
          marker.addTo(map).openPopup();
          newMarkersMap.set(key, marker);
        }
      }
    });

    // Remove old markers that aren't in the new set
    currentMarkersRef.current.forEach((marker) => {
      marker.remove();
    });

    // Update current markers reference
    currentMarkersRef.current = newMarkersMap;
  }, [markers]);

  return (
    <div className="sm:w-full sm:h-full sm:relative">
      <div
        id="map"
        className="fixed sm:absolute top-0 left-0 right-0 bottom-0 w-full z-0"
      />
    </div>
  );
}
