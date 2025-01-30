import NavButton from "@/components/bottombar/NavButton";
import { logout } from "@/lib/auth";
import type { ReactNode } from "react";
import { MeetUpProvider } from "./context";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <MeetUpProvider>
        <main>{children}</main>
      </MeetUpProvider>
    </>
  );
}
