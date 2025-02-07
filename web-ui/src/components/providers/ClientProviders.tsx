"use client";

import { ReactNode } from "react";
import { GeolocationProvider } from "@/context/geolocation-context";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <GeolocationProvider>{children}</GeolocationProvider>;
}
