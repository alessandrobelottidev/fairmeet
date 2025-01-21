import { AuthForm } from "@/components/auth/AuthForm";
import { requestPasswordReset } from "@/lib/auth";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border px-8 pb-6">
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
      </div>
    </div>
  );
}
