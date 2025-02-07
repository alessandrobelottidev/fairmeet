// layout.tsx
import { Bottombar } from "@/components/bottombar/Bottombar";
import type { ReactNode } from "react";
import { ClientProviders } from "@/components/providers/ClientProviders";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClientProviders>
      <div className="min-h-screen sm:min-h-fit h-full flex flex-col bg-gray-100 overflow-hidden">
        <main className="flex-[1] h-full max-w-7xl overflow-hidden">
          {children}
        </main>
        <Bottombar />
      </div>
    </ClientProviders>
  );
}
