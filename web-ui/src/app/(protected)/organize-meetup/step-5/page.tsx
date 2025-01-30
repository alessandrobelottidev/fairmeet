"use client";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-green-500 flex flex-col items-center justify-between p-8">
      <div /> {/* Spacer */}
      <div className="flex flex-col items-center text-white text-center">
        <div className="rounded-full border-4 border-white p-3 mb-6">
          <Check className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Il tuo ritrovo é pronto!</h1>
      </div>
      <div className="w-full space-y-4 max-w-md">
        <Link
          href="/group"
          className="block w-full py-4 px-6 bg-green-700 text-white text-center rounded-lg font-medium hover:bg-green-800 transition-colors"
        >
          VEDI NEL GRUPPO
        </Link>
        <Link
          href="/voting"
          className="block w-full py-4 px-6 bg-white text-green-500 text-center rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          VAI ALLE VOTAZIONI
        </Link>
      </div>
    </div>
  );
}
