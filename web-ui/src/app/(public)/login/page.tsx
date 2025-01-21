import { AuthForm } from "@/components/auth/AuthForm";
import { login } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border px-8 pb-6">
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
      </div>
    </div>
  );
}
