import { AuthForm } from "@/components/auth/AuthForm";
import { resetPassword } from "@/lib/auth";
import Link from "next/link";

export default async function ResetPasswordTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const resetPasswordWithToken = async (formData: FormData) => {
    "use server";
    formData.append("token", token);
    await resetPassword(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border px-8 pb-6">
        <AuthForm
          title="Set new password"
          subtitle="Enter your new password below"
          fields={[
            {
              name: "password",
              label: "New password",
              type: "password",
            },
            {
              name: "passwordConfirm",
              label: "Confirm new password",
              type: "password",
            },
          ]}
          action={resetPasswordWithToken}
          submitText="Reset password"
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
