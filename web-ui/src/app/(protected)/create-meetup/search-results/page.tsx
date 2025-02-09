"use client";

import { useEffect, useRef } from "react";
import {
  MeetingPlace,
  useMeetupCreation,
} from "@/context/meetup-creation-context";
import { useRouter } from "next/navigation";
import BottomSheet from "./BottomSheet";
import SearchResultsMap from "./SearchResultsMap";
import { clientFetch } from "@/lib/client-fetch";
import { ScoredPlace } from "@fairmeet/rest-api";
import { isValidUrl } from "@/lib/url";
import { Plus, Minus } from "lucide-react";
import ContinueButton from "@/components/meetup-creation/ContinueButton";

interface MeetupUserPreferences {
  coordinates: number[][];
  groupSize: number;
  preferences?: {
    maxDistance?: number;
    preferIndoor?: boolean;
    preferOutdoor?: boolean;
    activityType?: "active" | "relaxed";
  };
}

export default function SearchResultsPage() {
  const {
    setCurrentStep,
    updateMeetupData,
    meetupData,
    isStepComplete,
    currentStep,
    steps,
  } = useMeetupCreation();
  const router = useRouter();
  const mapRef = useRef<L.Map | null>(null);

  async function fetchAndSetRecommendations() {
    const data: MeetupUserPreferences = {
      coordinates: meetupData
        .friends!.filter((friend) => friend.lat && friend.long)
        .map((friend) => [Number(friend.lat), Number(friend.long)]),
      groupSize: meetupData.friends!.length,
      preferences: {
        maxDistance: 10,
        preferIndoor: false,
        preferOutdoor: false,
        activityType: "relaxed",
      },
    };

    const response = await clientFetch<ScoredPlace[]>("/v1/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    updateMeetupData({ recommendedPlaces: response });
  }

  useEffect(() => {
    if (!isStepComplete(currentStep - 1)) {
      router.replace(steps[currentStep - 1].path);
    } else {
      fetchAndSetRecommendations();
    }
  }, []);

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  const handlePlaceClick = (place: ScoredPlace) => {
    const map = mapRef.current;
    if (!map) return;

    const [lat, lng] = place.place.location.coordinates;
    map.setView([lat, lng], 18, {
      animate: true,
      duration: 1,
    });
  };

  const handleImageClick = (place: ScoredPlace, e: React.MouseEvent) => {
    e.stopPropagation();

    const placeType = place.place.startDateTimeZ
      ? ("event" as const)
      : ("spot" as const);
    const newPlace: MeetingPlace = {
      placeId: place.place._id,
      placeType,
    };

    updateMeetupData({
      selectedPlaces: meetupData.selectedPlaces
        ? meetupData.selectedPlaces.some((p) => p.placeId === place.place._id)
          ? meetupData.selectedPlaces.filter(
              (p) => p.placeId !== place.place._id
            )
          : [...meetupData.selectedPlaces, newPlace]
        : [newPlace],
    });
  };

  const isPlaceSelected = (placeId: string) => {
    return (
      meetupData.selectedPlaces?.some((p) => p.placeId === placeId) ?? false
    );
  };

  return (
    <div>
      <SearchResultsMap
        recommendedPlaces={meetupData.recommendedPlaces ?? []}
        mapRef={mapRef}
      />
      <BottomSheet minHeight={200} maxHeight={500}>
        <div className="mb-3 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Luoghi Vicini a te</h3>
          <span className="text-sm text-gray-500">
            {meetupData.recommendedPlaces?.length ?? "-"} risultati
          </span>
        </div>

        <div className="space-y-4 pb-24">
          {meetupData.recommendedPlaces?.map((recom) => (
            <div
              key={recom.place.id}
              onClick={() => handlePlaceClick(recom)}
              className="flex items-center gap-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div
                className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={(e) => handleImageClick(recom, e)}
              >
                <img
                  src={
                    isValidUrl(recom.place.featuredImageUrl)
                      ? recom.place.featuredImageUrl
                      : "/placeholder.jpg"
                  }
                  alt={recom.place.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onError={(e) => e.currentTarget.classList.add("opacity-0")}
                />
                <div
                  className={`
                  absolute inset-0 ml-[50%] -translate-x-1/2 mt-[50%] -translate-y-1/2 h-6 w-6 rounded-lg flex items-center justify-center
                  transition-colors duration-200
                  ${
                    isPlaceSelected(recom.place._id)
                      ? "bg-red-500/80"
                      : "bg-green-500/80"
                  }
                `}
                >
                  {isPlaceSelected(recom.place._id) ? (
                    <Minus className="text-white" size={24} />
                  ) : (
                    <Plus className="text-white" size={24} />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {recom.place.name}
                </h4>
                <p className="text-sm text-gray-500 truncate">
                  {recom.place.address}
                </p>
                <div className="flex flex-row items-center gap-2 mt-1">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    Score: {Math.round(recom.score * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-10 left-4 right-4">
          <ContinueButton>
            Condividi ({meetupData.selectedPlaces?.length ?? 0})
          </ContinueButton>
        </div>
      </BottomSheet>
    </div>
  );
}
