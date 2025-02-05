import { Crosshair } from "lucide-react";

export default function PinLocation() {
  return (
    <>
      <button className="absolute bottom-[140px] sm:bottom-[80px] right-2 shadow-md border border-[#51515140] rounded-full p-3 bg-white text-black z-0">
        <Crosshair size={20} />
      </button>
    </>
  );
}
