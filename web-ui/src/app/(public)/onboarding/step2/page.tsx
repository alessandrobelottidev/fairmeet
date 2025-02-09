"use client";
import NextButton from "@/components/ui/next-button";
import ImageContainer from "@/components/image-container";

export default function StepTwo() {
  return (
    <>
      {/* <div className="flex items-center self-center"> */}
      <h2 className="text-2xl font-bold m-2 self-center">MAPPA</h2>
      {/* </div> */}
      <ImageContainer url={"/onboarding/mappa.svg"} />
      <div className="flex flex-col mt-auto gap-8">
        <NextButton
          link={"/onboarding/step3"}
          className="bg-green-500 rounded-full ml-auto"
        />
        <div className="flex gap-2  justify-center">
          <div className="h-1 w-full rounded-full bg-gray-300" />
          <div className="h-1 w-full rounded-full bg-black" />
          <div className="h-1 w-full rounded-full bg-gray-300" />
          <div className="h-1 w-full rounded-full bg-gray-300" />
          <div className="h-1 w-full rounded-full bg-gray-300" />
        </div>
      </div>
    </>
  );
}
