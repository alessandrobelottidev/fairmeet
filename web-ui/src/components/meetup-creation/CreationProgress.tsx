"use client";
import { useMeetupCreation } from "@/context/meetup-creation-context";

export function CreationProgress() {
  const { currentStep, steps, isStepComplete } = useMeetupCreation();
  const percentage = (currentStep / steps.length) * 100;

  return (
    <div className="w-full px-4">
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
