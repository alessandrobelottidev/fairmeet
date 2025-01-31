import React, { useContext, useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { MeetUpContext } from "@/app/(protected)/organize-meetup/context";

const BottomSheet = () => {
  const { userCoordinates, userRecommendations, fetchRecommendations } =
    useContext(MeetUpContext);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSheet = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (userCoordinates) {
      fetchRecommendations([userCoordinates, userCoordinates], 0);
    }
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-2xl z-1 transition-all duration-300 ease-in-out"
      style={{
        height: isExpanded ? "90vh" : "120px",
        overflow: "hidden",
      }}
    >
      {/* Draggable handle */}
      <div
        className="w-full h-2 flex m-1 justify-center cursor-pointer"
        onClick={toggleSheet}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Title section */}
      <div className="px-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Luoghi Vicini a te</h3>
      </div>

      {/* Scrollable Content section */}
      <div
        className={`${
          isExpanded ? "h-[calc(90vh-116px)]" : "h-0"
        } overflow-y-auto px-4 pb-4`}
      >
        {isExpanded && (
          <div className="space-y-4">
            {userRecommendations.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                Nessun risultato trovato
              </div>
            ) : (
              userRecommendations.map((event) => (
                <div
                  key={event.place._id}
                  className="flex items-start space-x-4 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">
                      {event.place.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {event.place.description}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Spacer to ensure full scrollability */}
            <div className="h-20 w-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomSheet;
