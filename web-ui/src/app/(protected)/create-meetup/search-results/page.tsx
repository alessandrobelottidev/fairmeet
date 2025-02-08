"use client";

import { useEffect } from "react";
import { useMeetupCreation } from "@/context/meetup-creation-context";

export default function GroupSelectionStep() {
  const { setCurrentStep, updateMeetupData, meetupData } = useMeetupCreation();

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Search results</h1>
      {/* <form className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={meetupData.title}
            onChange={(e) => updateMeetupData({ title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </form> */}
    </div>
  );
}
