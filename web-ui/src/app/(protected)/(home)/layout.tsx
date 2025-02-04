import { Bottombar } from "@/components/bottombar/Bottombar";
import type { ReactNode } from "react";
import { MeetUpProvider } from "../organize-meetup/context";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MeetUpProvider>
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        <Bottombar />
      </div>
    </MeetUpProvider>
  );
}
