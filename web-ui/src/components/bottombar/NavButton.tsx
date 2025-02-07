"use client";

import { useRouter } from "next/navigation";

interface NavButtonProps {
  isActive: boolean;
  goTo: string;
  icon: React.ElementType;
  label: string;
}

const NavButton = ({ isActive, goTo, icon: Icon, label }: NavButtonProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(goTo);
      }}
      className={`flex flex-col items-center justify-center rounded-2xl w-14 h-14 ${
        isActive ? "bg-green-600 text-white" : "text-gray-600"
      } focus:outline-none transition-colors duration-200`}
    >
      <Icon size={24} />
      <span className="text-xs">{label}</span>
    </button>
  );
};

export default NavButton;
