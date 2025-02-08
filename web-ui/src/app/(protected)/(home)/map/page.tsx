"use client";
import MapComponent from "@/components/map/Map";
import PinLocation from "@/components/map/PinLocation";
import BottomSheet from "@/components/bottomsheet/BottomSheet";
import { useRef, useEffect, useState } from "react";
import fetchRecommendations from "@/lib/event-fetch";
import { ScoredPlace } from "@fairmeet/rest-api";
import L, { Map as LeafletMap } from "leaflet";
import { useGeolocation } from "@/context/geolocation-context";
import { isValidUrl } from "@/lib/url";
import MapMarker from "@/components/map/MapMarker";

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

  useEffect(() => {
    const getRecommendations = async () => {
      const { data, error } = await fetchRecommendations([viewCoordinates]);
      if (error) {
        console.log(error);
        return;
      }
      setRecommendations(data);
    };
    getRecommendations();
  }, [viewCoordinates]);

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

  // User marker
  const userMarker = MapMarker(
    userCoordinates,
    "green",
    "@you",
    "bg-white rounded-lg shadow-lg overflow-hidden"
  );

  // Events and spots markers
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

  const markers = [userMarker, ...eventMarkers];

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
