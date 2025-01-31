"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import Map from "@/components/map/Map";
import { useContext, useEffect, useMemo } from "react";
import PinLocation from "@/components/map/PinLocation";
import BottomSheet from "@/components/bottomsheet/BottomSheet";
import { MeetUpContext } from "../../organize-meetup/context";

export default function Mappa() {
  const { updateUserCoordinates } = useContext(MeetUpContext);
  const [latitude, longitude] = [46.068548, 11.123382];

  useEffect(() => {
    updateUserCoordinates(latitude, longitude);
  }, []);

  return (
    <>
      <Map latitude={latitude} longitude={longitude} />

      <PinLocation />
      <BottomSheet />
    </>
  );
}
