"use client";

import { useEffect, useState } from "react";
import { useMeetupCreation } from "@/context/meetup-creation-context";
import { Loader2, CheckCircle2, XCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { clientFetch } from "@/lib/client-fetch";

type Status = "loading" | "success" | "error";

export default function GroupSelectionStep() {
  const { setCurrentStep, isStepComplete, steps, currentStep, meetupData } =
    useMeetupCreation();
  const [status, setStatus] = useState<Status>("loading");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const createMeeting = async () => {
    if (!meetupData.radius) {
      throw new Error("Raggio non provvisto");
    }

    try {
      // Your actual fetch call would go here
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const res = await clientFetch("/v1/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group: meetupData.groupId,
          places: meetupData.selectedPlaces,
          radius: {
            center: {
              type: "Point",
              coordinates: [meetupData.radius.long, meetupData.radius.lat],
            },
            sizeInMeters: meetupData.radius.sizeInMeters,
          },
        }),
      });

      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!isStepComplete(currentStep - 1)) {
      router.replace(steps[currentStep - 1].path);
    } else {
      createMeeting();
    }
  }, []);

  useEffect(() => {
    setCurrentStep(4);
    setIsVisible(true);
  }, [setCurrentStep]);

  return (
    <div
      className={cn(
        "flex flex-col items-center space-y-2 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="text-xl font-semibold text-center animate-pulse">
            Stiamo creando un meeting apposta per te...
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="animate-bounce">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <p className="text-xl font-semibold text-center text-green-700">
            Meeting creato con successo!
          </p>
          <p className="text-gray-500 text-center">
            Abbiamo inviato gli inviti a tutti i partecipanti
          </p>
          <button
            onClick={() => router.push("/map")}
            className="flex !mt-5 items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            <MapPin size={20} />
            Torna alla mappa
          </button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="animate-shake">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <p className="text-xl font-semibold text-center text-red-700">
            Qualcosa è andato storto
          </p>
          <p className="text-gray-500 text-center">
            Per favore riprova più tardi
          </p>
          <button
            onClick={() => router.push("/map")}
            className="flex !mt-5 items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            <MapPin size={20} />
            Torna alla home
          </button>
        </>
      )}
    </div>
  );
}
