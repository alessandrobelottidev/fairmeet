import { Sidebar } from "@/components/sidebar/Sidebar";
import { logout } from "@/lib/auth";
import type { ReactNode } from "react";

export default async function ControlPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <section className="w-64">
        <Sidebar />
      </section>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
