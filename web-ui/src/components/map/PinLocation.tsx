import { MeetUpContext } from "@/app/(protected)/organize-meetup/context";
import { MapPinHouse } from "lucide-react";
import { useContext, useEffect } from "react";

export default function PinLocation() {
  const { userCoordinates, fetchRecommendations } = useContext(MeetUpContext);

  return (
    <>
      <button className="absolute bottom-32 right-2 border rounded-full p-4 bg-green-600 text-white z-0">
        <MapPinHouse size={24} />
      </button>
    </>
  );
}
