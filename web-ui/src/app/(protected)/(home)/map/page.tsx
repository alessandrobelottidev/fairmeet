"use client";
import Map from "@/components/map/Map";
import PinLocation from "@/components/map/PinLocation";
import BottomSheet from "@/components/bottomsheet/BottomSheet";
import { useRef, useEffect, useState } from "react";
import fetchRecommendations from "@/lib/event-fetch";
import { ScoredPlace } from "@fairmeet/rest-api";
import { Map as LeafletMap } from "leaflet";
import { useGeolocation } from "@/context/geolocation-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function MapPage() {
  let { coordinates, error, permissionStatus, requestPermission, isTracking } =
    useGeolocation();
  const [recommendations, setRecommendations] = useState<ScoredPlace[]>([]);
  const mapRef = useRef<LeafletMap | null>(null);

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

  const handlePinClick = () => {
    if (mapRef.current) {
      mapRef.current.setView([coordinates[0], coordinates[1]], 15, {
        animate: true,
        duration: 1,
      });
    }
  };

  // Show permission request if not tracking
  if (permissionStatus === "prompt" && !isTracking) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Alert className="mb-4">
          <AlertDescription>
            To provide you with location-based recommendations, we need access
            to your location.
          </AlertDescription>
        </Alert>
        <Button onClick={requestPermission}>Share Location</Button>
      </div>
    );
  }

  // Show error if permission denied
  // if (permissionStatus === "denied") {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full p-4">
  //       <Alert variant="destructive" className="mb-4">
  //         <AlertDescription>
  //           Location access was denied. Please enable location sharing in your
  //           browser settings to use this feature.
  //         </AlertDescription>
  //       </Alert>
  //     </div>
  //   );
  // }

  return (
    <>
      <Map
        coordinates={coordinates}
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
