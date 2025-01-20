"use client";

import { useAuth } from "@/context/auth.context";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to FairMeet</h1>
      <p>You are logged in as: {user?.handle}</p>
    </div>
  );
}
