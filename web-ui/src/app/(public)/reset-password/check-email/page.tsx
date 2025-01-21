import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="rounded-md bg-white shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Check your email
          </h2>
          <p className="text-gray-600 mb-6">
            If an account exists with the email you provided, you will receive
            password reset instructions shortly.
          </p>
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
