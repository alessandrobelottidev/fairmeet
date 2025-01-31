import ActionBar from "@/components/actionbar/Actionbar";
import Link from "next/link";

export default function Chat() {
  return (
    <>
      <Link href="/organize-meetup/step-1">
        <ActionBar name="Organizza ritrovo" />
      </Link>
    </>
  );
}
