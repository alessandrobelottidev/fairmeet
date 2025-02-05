"use client";
import Map from "@/components/map/Map";
import PinLocation from "@/components/map/PinLocation";
import BottomSheet from "@/components/bottomsheet/BottomSheet";
import { useEffect, useRef, useState } from "react";
import fetchRecommendations from "@/lib/event-fetch";
import { ScoredPlace } from "@fairmeet/rest-api";
import { Map as LeafletMap } from "leaflet";

export default function MapPage() {
  const [userCoordinates, setUserCoordinates] = useState([
    46.068548, 11.123382,
  ]);
  const [recommendations, setRecommendations] = useState<ScoredPlace[]>([]);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const getRecommendations = async () => {
      const { data, error } = await fetchRecommendations([userCoordinates]);
      if (error) {
        console.log(error);
        return;
      }
      setRecommendations(data);
    };
    getRecommendations();
  }, [userCoordinates]);

  const handlePinClick = () => {
    if (mapRef.current) {
      mapRef.current.setView([userCoordinates[0], userCoordinates[1]], 15, {
        animate: true,
        duration: 1,
      });
    }
  };

  return (
    <>
      <Map
        coordinates={userCoordinates}
        recommendations={recommendations}
        mapRef={mapRef}
      />
      <div className="sm:relative">
        <PinLocation onPinClick={handlePinClick} />
      </div>

      <BottomSheet recommendations={recommendations} />
    </>
  );
}
