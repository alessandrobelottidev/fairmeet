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
      <div className="min-h-screen flex flex-col bg-gray-100">
        <main className="flex-[1] h-full max-w-7xl sm:px-6 lg:px-8">
          {children}
        </main>

        <Bottombar />
      </div>
    </MeetUpProvider>
  );
}
