"use client";
import NextButton from "@/components/ui/next-button";
import { useRouter } from "next/navigation";

export default function StepFour() {
  const router = useRouter();

  return (
    <>
      <h2 className="text-2xl font-bold mb-8">INCONTRI</h2>
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
            <div className="h-1 w-full rounded-full bg-black" />
          </div>
        </div>
      </div>
    </>
  );
}
