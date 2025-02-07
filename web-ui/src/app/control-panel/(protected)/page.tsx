import { getCurrentUser } from "@/lib/auth";

export default async function ControlPanelHomePage() {
  const user = await getCurrentUser();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to the Control Panel, {user?.handle}!
      </h1>
      <p className="text-gray-600 mb-4">
        Your role:{" "}
        {user?.role === "business_owner"
          ? "Business Owner"
          : "Government Entity"}
      </p>
      <p className="text-gray-600">
        From here you can manage your organization&apos;s presence on FairMeet.
      </p>
    </div>
  );
}
