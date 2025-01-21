import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome, {user?.handle}!
      </h1>
      <p className="text-gray-600">
        This is your FairMeet dashboard. Here you'll be able to manage your
        meetings and interactions.
      </p>
    </div>
  );
}
