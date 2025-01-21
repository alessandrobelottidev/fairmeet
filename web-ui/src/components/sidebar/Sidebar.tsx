import Image from "next/image";
import logoSvg from "../../../public/logo.svg";
import { LogOutButton } from "./LogOutButton";
import { Button } from "./Button";

export function Sidebar() {
  return (
    <div className="bg-green-700 text-white min-h-screen py-6 px-4 flex flex-col items-start gap-4">
      <Image
        src={logoSvg}
        alt={"Fairmeet Logo"}
        className="max-h-12 w-auto pl-2"
      />
      <div className="flex flex-col justify-between flex-1 w-full">
        <nav className="h-full w-full">
          <Button>
            <div>Panoramica</div>
          </Button>

          <Button>
            <div>Eventi</div>
          </Button>

          <Button>
            <div>Spot</div>
          </Button>
        </nav>
        <LogOutButton />
      </div>
    </div>
  );
}
