import type { ReactNode } from "react";

export default async function MakeItMobileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-slate-400 sm:h-screen sm:flex sm:justify-center sm:items-center sm:py-8">
      <div className="max-w-screen-sm h-full bg-gray-100 w-full sm:aspect-[9/19.5] sm:mx-auto sm:outline sm:outline-slate-600 sm:rounded-2xl sm:overflow-hidden sm:max-h-screen">
        {children}
      </div>
    </div>
  );
}
