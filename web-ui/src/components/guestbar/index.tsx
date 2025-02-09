"use client";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const GuestBanner = () => {
  const router = useRouter();

  const handleRegistration = () => {
    router.push("/register");
  };

  return (
    <div className="w-full bg-orange-400 px-4 py-2 flex items-center justify-between text-white absolute top-0 left-0 z-10">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">SEI IN MODALITÀ OSPITE</span>
      </div>
      <button
        onClick={handleRegistration}
        className="bg-transparent hover:bg-white/10 px-4 py-1 rounded transition-colors duration-200 flex items-center"
      >
        Registrati
        <span className="ml-2">→</span>
      </button>
    </div>
  );
};

export default GuestBanner;
