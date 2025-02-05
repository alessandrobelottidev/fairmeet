"use client";
import Map from "@/components/map/Map";
import PinLocation from "@/components/map/PinLocation";
import BottomSheet from "@/components/bottomsheet/BottomSheet";
import { useEffect, useState } from "react";
import fetchRecommendations from "@/lib/event-fetch";
import { ScoredPlace } from "@fairmeet/rest-api";

export default function MapPage() {
  const [coordinates, setCoordinates] = useState([46.068548, 11.123382]);
  const [recommendations, setRecommendations] = useState<ScoredPlace[]>([]);

  useEffect(() => {
    const getRecommendations = async () => {
      const { data, error } = await fetchRecommendations([coordinates]);
      if (error) {
        console.log(error);
        return;
      }
      setRecommendations(data);
    };
    getRecommendations();
  }, [coordinates]);

  return (
    <>
      <Map coordinates={coordinates} recommendations={recommendations} />
      <div className="sm:relative">
        <PinLocation />
      </div>

      <BottomSheet recommendations={recommendations} />
    </>
  );
}
