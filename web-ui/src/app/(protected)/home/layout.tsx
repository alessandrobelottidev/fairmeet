import { Bottombar } from "@/components/bottombar/Bottombar";
import NavButton from "@/components/bottombar/NavButton";
import { logout } from "@/lib/auth";
import type { ReactNode } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">FairMeet</span>
              </div>
            </div>
            <form action={logout} className="flex items-center">
              <button
                type="submit"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
      <Bottombar />
    </div>
  );
}
