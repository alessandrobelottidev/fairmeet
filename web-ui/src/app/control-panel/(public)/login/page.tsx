import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser, login } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import trentoBg from "../../../../../public/trento-bg.jpg";
import { redirect } from "next/navigation";

export default async function ControlPanelLoginPage() {
  // If user is already authenticated, redirect to appropriate page
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "basic" ? "/map" : "/control-panel");
  }

  return (
    <div className="min-h-screen flex flex-row lg:grid-cols-3 bg-white">
      <div className="w-full p-4 flex flex-col items-center justify-center flex-1 lg:max-w-2xl">
        <div className="max-w-lg">
          <AuthForm
            title="Business & Government Portal"
            subtitle="Sign in to your account"
            fields={[
              {
                name: "email",
                label: "Email address",
                type: "email",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
              },
            ]}
            action={login}
            submitText="Sign in"
          >
            <div className="flex flex-col items-center justify-between space-y-2 mt-4">
              <Link
                href="/control-panel/register"
                className="text-sm text-green-600 transition-all hover:text-green-500"
              >
                Request business account
              </Link>
              <Link
                href="/reset-password"
                className="text-sm text-green-600 transition-all hover:text-green-500"
              >
                Forgot your password?
              </Link>
            </div>
          </AuthForm>
        </div>
      </div>

      <div className="hidden lg:block lg:flex-1 relative">
        <Image
          src={trentoBg}
          alt={"Trento background"}
          objectFit="cover"
          fill
        />
      </div>
    </div>
  );
}
