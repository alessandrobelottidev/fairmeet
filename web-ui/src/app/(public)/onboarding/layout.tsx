import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen bg-gray-100 p-4 flex flex-col gap-4">
      {children}
    </div>
  );
}
