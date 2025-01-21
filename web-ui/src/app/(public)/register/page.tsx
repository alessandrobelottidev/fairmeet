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
  );
}
