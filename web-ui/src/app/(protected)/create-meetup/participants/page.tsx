"use client";

import { useEffect, useState } from "react";
import { useMeetupCreation } from "@/context/meetup-creation-context";
import { useRouter } from "next/navigation";
import ContinueButton from "@/components/meetup-creation/ContinueButton";

export default function ParticipantsStep() {
  const {
    setCurrentStep,
    updateMeetupData,
    meetupData,
    isStepComplete,
    currentStep,
    steps,
  } = useMeetupCreation();
  const router = useRouter();

  useEffect(() => {
    if (!isStepComplete(currentStep - 1)) {
      // well we must first be in the right state of mind
      router.replace(steps[currentStep - 1].path);
    }
  }, []);

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-center">
        Posizioni dei tuoi amici
      </h1>
      <div className="space-y-4">
        {meetupData.friends &&
          meetupData.friends.map((friend, i) => (
            <div className="flex flex-row gap-4" key={i}>
              <div className="flex flex-col flex-1 space-y-1">
                <p className="text-sm font-medium">Handle amico:</p>
                <p className="rounded-full border-2 py-1.5 px-3">
                  @{friend.user.handle}
                </p>
              </div>
              <div className="flex flex-col space-y-1 flex-1 min-w-[170px]">
                <p className="text-sm font-medium">Posizione (Lat, Long):</p>
                <p
                  className="rounded-full border-2 py-1.5 px-3 truncate overflow-hidden"
                  onClick={() => {
                    updateMeetupData({ userPositionToChange: friend.user });
                    router.push("/create-meetup/participants/map");
                  }}
                >
                  {friend.lat && friend.long
                    ? `${friend.lat}, ${friend.long}`
                    : "Sconosciuta"}
                </p>
              </div>
            </div>
          ))}
      </div>

      <ContinueButton>Cerca posto d'incontro</ContinueButton>
    </div>
  );
}
