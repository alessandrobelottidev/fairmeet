import { AuthForm } from "@/components/auth/AuthForm";
import { login } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthForm
      title="Welcome back"
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
          href="/register"
          className="text-sm text-green-600 transition-all hover:text-green-500"
        >
          Need an account? Sign up
        </Link>
        <Link
          href="/reset-password"
          className="text-sm text-green-600 transition-all hover:text-green-500"
        >
          Forgot your password?
        </Link>
      </div>
    </AuthForm>
  );
}
