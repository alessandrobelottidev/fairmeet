"use client";
import ImageContainer from "@/components/image-container";
import NextButton from "@/components/ui/next-button";

export default function StepFive() {
  return (
    <>
      <h2 className="text-2xl font-bold m-2 self-center">CREA INCONTRI</h2>
      <ImageContainer url={"/onboarding/meetup-creation.png"} />
      <div className="flex flex-col mt-auto gap-8">
        <NextButton
          link={"/map"}
          className="bg-green-500 rounded-full ml-auto"
        />
        <div className="flex flex-col mt-auto gap-8">
          <div className="flex gap-2 justify-center">
            <div className="h-1 w-full rounded-full bg-gray-300" />
            <div className="h-1 w-full rounded-full bg-gray-300" />
            <div className="h-1 w-full rounded-full bg-gray-300" />
            <div className="h-1 w-full rounded-full bg-gray-300" />
            <div className="h-1 w-full rounded-full bg-black" />
          </div>
        </div>
      </div>
    </>
  );
}
