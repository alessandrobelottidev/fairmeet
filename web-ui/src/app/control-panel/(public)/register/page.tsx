import Link from "next/link";

export default function ControlPanelRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Request Business Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Contact us to set up your business or government account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-white shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                For Businesses
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                If you represent a business and would like to join FairMeet,
                please contact us at:
              </p>
              <a
                href="mailto:business@fairmeet.com"
                className="mt-2 block text-green-600 transition-all hover:text-green-500"
              >
                business@fairmeet.com
              </a>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                For Government Entities
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                If you represent a government entity, please reach out to:
              </p>
              <a
                href="mailto:government@fairmeet.com"
                className="mt-2 block text-green-600 transition-all hover:text-green-500"
              >
                government@fairmeet.com
              </a>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/control-panel/login"
              className="text-sm font-medium text-green-600 transition-all hover:text-green-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
