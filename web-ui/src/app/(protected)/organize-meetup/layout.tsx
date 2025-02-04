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
