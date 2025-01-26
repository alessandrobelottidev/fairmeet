"use client";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import BackButton from "@/components/ui/back-button";

const OrganizeMeetup = () => {
  const [people, setPeople] = useState(3);

  return (
    <div className="p-6 pt-10 space-y-6 flex flex-col items-center justify-center min-h-screen">
      <BackButton link={"/home/map"} className="absolute top-4 left-4" />
      <div className="bg-white flex flex-col max-w-xs mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Organizza ritrovo
        </h1>

        <div className="flex flex-col items-center flex-grow">
          <p className="text-lg mb-8">Scegli numero di persone:</p>

          <div className="flex items-center justify-between w-full mb-8">
            <button
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <Minus size={24} />
            </button>

            <span className="text-4xl font-medium">{people}</span>

            <button
              onClick={() => setPeople(Math.min(10, people + 1))}
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <Plus size={24} />
            </button>
          </div>

          <Link
            href={{
              pathname: "/organize-meetup/second-step",
              query: { people },
            }}
            className="w-full mx-auto bg-black text-white rounded-full py-4 font-medium text-center"
          >
            CONTINUA
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizeMeetup;
