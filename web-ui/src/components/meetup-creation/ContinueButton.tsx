"use client";

import { useMeetupCreation } from "@/context/meetup-creation-context";
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
      console.log("NOT READY BOYYYY");
    }
  }

  return (
    <div>
      <button
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
