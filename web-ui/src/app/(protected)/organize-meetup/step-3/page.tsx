"use client";
import { useContext, useEffect, useState } from "react";
import { MeetUpContext } from "../context";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  const {
    recommendations,
    selectedEvents,
    fetchRecommendations,
    toggleEventSelection,
  } = useContext(MeetUpContext);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Eventi e punti di interesse
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Trovati {recommendations.length} risultati
        </p>

        <div className="space-y-4">
          {recommendations.map((event) => (
            <div
              key={event.place._id}
              className="flex items-start space-x-4 border border-gray-200 rounded-lg p-4"
            >
              <button
                onClick={() => toggleEventSelection(event)}
                className={`p-2 rounded-lg ${
                  selectedEvents.has(event)
                    ? "bg-red-100 hover:bg-red-200"
                    : "bg-green-100 hover:bg-green-200"
                }`}
              >
                {selectedEvents.has(event) ? (
                  <Minus className="w-6 h-6 text-red-500" />
                ) : (
                  <Plus className="w-6 h-6 text-green-500" />
                )}
              </button>

              <div className="flex-1">
                <h2 className="font-semibold text-gray-800">
                  {event.place.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {event.place.description}
                </p>
                <button className="mt-2 px-4 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors">
                  Dettagli
                </button>
              </div>
            </div>
          ))}
        </div>

        <Link href="/organize-meetup/step-4">
          <button className="w-full mt-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
            CONDIVIDI RITROVO ({selectedEvents.size})
          </button>
        </Link>
      </div>
    </div>
  );
}
