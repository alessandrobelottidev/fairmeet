"use client";

import React, { useState } from "react";
import { ScoredPlace } from "@fairmeet/rest-api";
import { PlaceItem } from "./PlaceItem";

interface BottomSheetProps {
  recommendations: ScoredPlace[];
}

const BottomSheet: React.FC<BottomSheetProps> = ({ recommendations }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSheet = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate distance in km
  const formatDistance = (score: number) => {
    return score.toFixed(1);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-2xl z-1 transition-all duration-300 ease-in-out"
      style={{
        height: isExpanded ? "90vh" : "130px",
        overflow: "hidden",
      }}
    >
      <div
        className="w-full h-2 flex m-2 justify-center cursor-pointer"
        onClick={toggleSheet}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Title section */}
      <div className="px-4 mb-3 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Luoghi Vicini a te</h3>
        <span className="text-sm text-gray-500">
          {recommendations.length} risultati
        </span>
      </div>

      {/* Scrollable Content section */}
      <div
        className={`${
          isExpanded ? "h-[calc(90vh-116px)]" : "h-0"
        } overflow-y-auto px-4 pb-4`}
      >
        {isExpanded && (
          <div className="space-y-4 pb-5">
            {recommendations.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                Nessun risultato trovato
              </div>
            ) : (
              recommendations.map(({ place }, i) => (
                <PlaceItem place={place} key={i} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomSheet;
