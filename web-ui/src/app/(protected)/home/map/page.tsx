"use client";
import ActionBar from "@/components/actionbar/Actionbar";
import Link from "next/link";

export default function Mappa() {
  return (
    <>
      <Link href="/organize-meetup/first-step">
        <ActionBar name="Organizza ritrovo" />
      </Link>
    </>
  );
}
