import { AuthForm } from "@/components/auth/AuthForm";
import { requestPasswordReset } from "@/lib/auth";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <AuthForm
      title="Reset your password"
      subtitle="Enter your email address to receive reset instructions"
      fields={[
        {
          name: "email",
          label: "Email address",
          type: "email",
        },
      ]}
      action={requestPasswordReset}
      submitText="Send reset instructions"
    >
      <div className="text-center mt-4">
        <Link
          href="/login"
          className="text-sm text-green-600 transition-all hover:text-green-500"
        >
          Back to login
        </Link>
      </div>
    </AuthForm>
  );
}
