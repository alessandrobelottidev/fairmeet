import Map from "@/components/map/Map";
import PinLocation from "@/components/map/PinLocation";
import BottomSheet from "@/components/bottomsheet/BottomSheet";

export default function MapPage() {
  const [latitude, longitude] = [46.068548, 11.123382];

  return (
    <>
      <Map latitude={latitude} longitude={longitude} />

      <PinLocation />
      <BottomSheet />
    </>
  );
}
