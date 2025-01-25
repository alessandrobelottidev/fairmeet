"use client";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const OrganizeMeetup = () => {
  const [people, setPeople] = useState(3);

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <Link href="/home/map">
        <button className="mb-12">
          <ArrowLeft size={24} />
        </button>
      </Link>

      <h1 className="text-3xl font-bold text-center mb-16">
        Organizza ritrovo
      </h1>

      <div className="flex flex-col items-center flex-grow">
        <p className="text-lg mb-8">Scegli numero di persone:</p>

        <div className="flex items-center justify-between w-full max-w-xs mb-12">
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
          href={{ pathname: "/organize-meetup/second-step", query: { people } }}
        >
          <button className="w-full max-w-xs bg-black text-white rounded-full py-4 font-medium">
            CONTINUA
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrganizeMeetup;
