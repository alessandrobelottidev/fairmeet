import { logoutControlPanel } from "@/lib/auth";
import { Button } from "./Button";

export function LogOutButton() {
  return (
    <form
      action={logoutControlPanel}
      method="POST"
      className="flex items-center"
    >
      <Button>
        <button className="w-full text-left" type="submit">
          Sign out
        </button>
      </Button>
    </form>
  );
}
