"use client";

import NavButton from "./NavButton";
import { UserCircle2, Map, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const tabs = [
  {
    label: "Ritrovi",
    icon: UserCircle2,
    goTo: "/meetup",
  },
  {
    label: "Mappa",
    icon: Map,
    goTo: "/map",
  },
  {
    label: "Chat",
    icon: MessageSquare,
    goTo: "/chat",
  },
];

export function Bottombar() {
  const [activeTab, setActiveTab] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    tabs.forEach((tab) => {
      if (pathname.endsWith(tab.goTo)) {
        setActiveTab(tab.goTo);
      }
    });
  }, [pathname]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-5">
      {tabs.map((tab, i) => (
        <NavButton
          goTo={tab.goTo}
          isActive={activeTab === tab.goTo}
          icon={tab.icon}
          label={tab.label}
          key={i}
        />
      ))}
    </div>
  );
}
