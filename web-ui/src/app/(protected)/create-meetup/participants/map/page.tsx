"use client";

import { useEffect, useRef } from "react";
import { useMeetupCreation } from "@/context/meetup-creation-context";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import "leaflet/dist/leaflet.css";
import "./map.css";

// Define types for your meetup data
interface Friend {
  user: {
    handle: string;
  };
  lat: number;
  long: number;
}

interface MeetupData {
  friends?: Friend[];
  userPositionToChange?: {
    handle: string;
  };
  // Add other properties as needed
}

// Import Leaflet only on client side
const MapComponent = dynamic(() => import('./MapClientComponent.tsx'), {
  ssr: false, // This will disable server-side rendering for this component
  loading: () => <div>Loading map...</div>,
});

export default function MapContent() {
  const router = useRouter();
  const { updateMeetupData, meetupData } = useMeetupCreation();

  return (
    <div className="w-full h-[calc(_100vh_-_30px_)] overflow-hidden relative">
      <MapComponent 
        meetupData={meetupData as MeetupData} 
        updateMeetupData={updateMeetupData} 
        onSavePosition={(lat: number, lng: number) => {
          if (meetupData.userPositionToChange && meetupData.friends) {
            const temp = [...meetupData.friends];

            temp.forEach((friend) => {
              if (friend.user.handle === meetupData.userPositionToChange?.handle) {
                friend.lat = lat;
                friend.long = lng;
              }
            });

            updateMeetupData({ friends: temp });
            router.back();
          }
        }}
      />
    </div>
  );
}