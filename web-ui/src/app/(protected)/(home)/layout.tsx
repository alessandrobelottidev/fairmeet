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
      <div className="min-h-screen sm:min-h-[calc(_100vw_-_70px)] h-full flex flex-col bg-gray-100">
        <main className="flex-[1] h-full max-w-7xl">{children}</main>

        <Bottombar />
      </div>
    </MeetUpProvider>
  );
}
