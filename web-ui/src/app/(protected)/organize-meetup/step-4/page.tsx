"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { MeetUpContext } from "../context";

export default function CreateGroupPage() {
  const router = useRouter();
  const { groupName, updateGroupName } = useContext(MeetUpContext);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (groupName.trim()) {
      // Handle group creation logic here
      router.push("/home/chat"); // Redirect to success page after creation
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-8">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nome gruppo</h1>
        <p className="text-gray-600 mb-6">Scegli il nome di questo gruppo:</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={groupName}
            onChange={(e) => updateGroupName(e.target.value)}
            placeholder="Name group"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          />

          <button
            type="submit"
            className="w-full py-4 px-6 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            CREA GRUPPO
          </button>
        </form>
      </div>

      {/* Progress bar at bottom */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gray-200">
        <div className="h-full bg-green-500 w-1/3" />
      </div>
    </div>
  );
}
