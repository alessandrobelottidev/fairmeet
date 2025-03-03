"use client";
import { useRef, useEffect, useState } from "react";
import BottomSheet from "@/components/bottomsheet/BottomSheet";
import fetchRecommendations from "@/lib/event-fetch";
import { ScoredPlace } from "@fairmeet/rest-api";
import { useGeolocation } from "@/context/geolocation-context";
import { isValidUrl } from "@/lib/url";
import dynamic from 'next/dynamic';
import type { Map as LeafletMap } from "leaflet";

// Only dynamically import React components, not functions
const MapComponent = dynamic(() => import("@/components/map/Map"), { ssr: false });
const PinLocation = dynamic(() => import("@/components/map/PinLocation"), { ssr: false });

// Import MapMarker normally since it's a function, not a component
// But we'll use it only on the client side
let MapMarker: any = null;

export default function MapPage() {
  let {
    userCoordinates,
    error,
    permissionStatus,
    requestPermission,
    isTracking,
  } = useGeolocation();
  const [recommendations, setRecommendations] = useState<ScoredPlace[]>([]);
  const mapRef = useRef<LeafletMap | null>(null);
  const [viewCoordinates, setViewCoordinates] = useState(userCoordinates);
  const [isClient, setIsClient] = useState(false);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Import MapMarker only on client side
    import("@/components/map/MapMarker").then((module) => {
      MapMarker = module.default;
      setIsClient(true);
      
      // Create markers once MapMarker is available
      updateMarkers();
    });
  }, []);

  // Update markers when recommendations or userCoordinates change
  useEffect(() => {
    if (isClient && MapMarker) {
      updateMarkers();
    }
  }, [recommendations, userCoordinates, isClient]);

  // Function to update markers
  const updateMarkers = () => {
    if (!MapMarker) return;
    
    const userMarker = MapMarker(
      userCoordinates,
      "green",
      "@you",
      "bg-white rounded-lg shadow-lg overflow-hidden"
    );

    const eventMarkers = recommendations.map((event) => {
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

      return MapMarker([lat, lng], "black", popupContent);
    });

    setMarkers([userMarker, ...eventMarkers]);
  };

  useEffect(() => {
    if (!isClient) return; // Skip server-side execution
    
    const getRecommendations = async () => {
      const { data, error } = await fetchRecommendations([viewCoordinates]);
      if (error) {
        console.log(error);
        return;
      }
      setRecommendations(data);
    };
    getRecommendations();
  }, [viewCoordinates, isClient]);

  const updateViewCoordinates = (coordinates: [number, number]) => {
    setViewCoordinates(coordinates);
  };

  const handlePinClick = () => {
    requestPermission();
    if (mapRef.current) {
      mapRef.current.setView([userCoordinates[0], userCoordinates[1]], 15, {
        animate: true,
        duration: 1,
      });
    }
  };

  // Only render map-related components on the client
  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">Loading map...</div>;
  }

  return (
    <>
      <MapComponent
        userCoordinates={userCoordinates}
        mapRef={mapRef}
        markers={markers}
        updateView={updateViewCoordinates}
      />

      <div className="sm:relative">
        <PinLocation onPinClick={handlePinClick} />
      </div>
      <BottomSheet recommendations={recommendations} />
    </>
  );
}