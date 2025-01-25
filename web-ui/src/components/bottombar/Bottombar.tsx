"use client";

import NavButton from "./NavButton";
import { UserCircle2, Map, MessageSquare } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export function Bottombar() {
  const [activeTab, setActiveTab] = useState("");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16">
      <Link href="/home/meetup">
        <NavButton
          icon={UserCircle2}
          label="Ritrovi"
          isActive={activeTab === "ritrovi"}
          onClick={() => setActiveTab("ritrovi")}
        />
      </Link>

      <Link href="/home/map">
        <NavButton
          icon={Map}
          label="Mappa"
          isActive={activeTab === "mappa"}
          onClick={() => setActiveTab("mappa")}
        />
      </Link>

      <Link href="/home/chat">
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
