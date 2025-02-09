"use client";
import NextButton from "@/components/ui/next-button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function StepFour() {
  const router = useRouter();

  return (
    <>
      <div className="h-auto justify-center items-center flex flex-col grow">
        <Image
          src="/onboarding/welcome_cats.svg"
          alt="Responsive SVG"
          width={300} // specify appropriate width
          height={300} // specify appropriate height
          className="svg-image"
        />

        <h1 className="text-4xl font-bold text-center mb-4 tracking-wider text-gray-800">
          WELCOME
        </h1>
        <h2 className="text-2xl font-bold mb-2">Benvenuti in FairMeet!</h2>
        <p className="text-gray-600 italic mb-8">
          L&apos;app per trovare eventi e punti di interesse più vicini tra la
          tua posizione e quella dei tuoi amici.
        </p>
        <button
          onClick={() => router.push("/onboarding/step2")}
          className="w-full bg-green-600 text-white px-6 rounded-full flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
        >
          SCOPRI COME FUNZIONA
          <NextButton link="" />
        </button>
      </div>
      <div className="flex gap-2">
        <div className="h-1 w-full rounded-full bg-black" />
        <div className="h-1 w-full rounded-full bg-gray-300" />
        <div className="h-1 w-full rounded-full bg-gray-300" />
        <div className="h-1 w-full rounded-full bg-gray-300" />
      </div>
    </>
  );
}
