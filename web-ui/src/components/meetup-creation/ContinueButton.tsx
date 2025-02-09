"use client";

import { useMeetupCreation } from "@/context/meetup-creation-context";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  callBack?: () => Promise<void>;
  children: React.ReactNode;
}

export default function ContinueButton({ callBack, children }: Props) {
  const { currentStep, setCurrentStep, steps, isStepComplete } =
    useMeetupCreation();
  const router = useRouter();

  async function goToNextStep() {
    if (currentStep + 1 > steps.length) {
      return;
    }

    if (isStepComplete(currentStep)) {
      router.push(steps[currentStep].path);
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Errore",
        description: "Alcuni campi sono vuoti",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  return (
    <div>
      <button
        className="bg-black px-4 py-2 text-white rounded-full w-full font-semibold"
        onClick={async () => {
          if (callBack) {
            await callBack();
          }
          await goToNextStep();
        }}
      >
        {children}
      </button>
    </div>
  );
}
