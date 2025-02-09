"use client";
import ImageContainer from "@/components/image-container";
import NextButton from "@/components/ui/next-button";

export default function StepThree() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">CHAT</h2>
      <ImageContainer url={"/onboarding/chat.svg"} />
      <div className="flex flex-col mt-auto gap-8">
        <NextButton
          link={"/onboarding/step4"}
          className="bg-green-500 rounded-full ml-auto"
        />
        <div className="flex gap-2 justify-center">
          <div className="h-1 w-full rounded-full bg-gray-300" />
          <div className="h-1 w-full rounded-full bg-gray-300" />
          <div className="h-1 w-full rounded-full bg-black" />
          <div className="h-1 w-full rounded-full bg-gray-300" />
          <div className="h-1 w-full rounded-full bg-gray-300" />
        </div>
      </div>
    </>
  );
}
