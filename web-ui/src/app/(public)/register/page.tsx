import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser, register } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  // If user is already authenticated, redirect to appropriate page
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "basic" ? "/" : "/control-panel");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border px-8 pb-6">
        <AuthForm
          title="Create an account"
          subtitle="Get started with FairMeet"
          fields={[
            {
              name: "handle",
              label: "Username",
              type: "text",
            },
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
          action={register}
          submitText="Sign up"
        >
          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-sm text-green-600 transition-all hover:text-green-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </AuthForm>
      </div>
    </div>
  );
}
