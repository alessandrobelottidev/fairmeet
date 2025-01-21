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
    formData.append(
      "token",
      "jxmlvlLKT-S2eZJJk8Ll7a5qHCs+a4cc3893c71e16f477e2"
    );
    await resetPassword(formData);
  };

  return (
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
  );
}
