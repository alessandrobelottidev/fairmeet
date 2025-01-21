import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser, login } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ControlPanelLoginPage() {
  // If user is already authenticated, redirect to appropriate page
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "basic" ? "/" : "/control-panel");
  }

  return (
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
      <div className="flex items-center justify-between mt-4">
        <Link
          href="/control-panel/register"
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Request business account
        </Link>
        <Link
          href="/reset-password"
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Forgot your password?
        </Link>
      </div>
    </AuthForm>
  );
}
