"use client";

import NavButton from "./NavButton";
import { UserCircle2, Map, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export function Bottombar() {
  const [activeTab, setActiveTab] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.endsWith("/meetup")) {
      setActiveTab("meetup");
    } else if (pathname.endsWith("/map")) {
      setActiveTab("map");
    } else if (pathname.endsWith("/chat")) {
      setActiveTab("chat");
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16">
      <Link href="/meetup">
        <NavButton
          icon={UserCircle2}
          label="Ritrovi"
          isActive={activeTab === "meetup"}
          onClick={() => setActiveTab("meetup")}
        />
      </Link>

      <Link href="/map">
        <NavButton
          icon={Map}
          label="Mappa"
          isActive={activeTab === "map"}
          onClick={() => setActiveTab("map")}
        />
      </Link>

      <Link href="/chat">
        <NavButton
          icon={MessageSquare}
          label="Chat"
          isActive={activeTab === "chat"}
          onClick={() => setActiveTab("chat")}
        />
      </Link>
    </div>
  );
}
