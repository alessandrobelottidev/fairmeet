"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useChatManager } from "@/hooks/useChatManager";
import type { User } from "@/lib/auth";
import { MemberSearch } from "@/components/chat/MemberSearch";
import { MemberList } from "@/components/chat/MemberList";
import { createGroup, addGroupMember } from "@/app/actions/chat";

interface Member {
  id: string;
  handle: string;
}

export default function NewGroupPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const chatManager = useChatManager(user?.id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await chatManager.getAuthUser();
        setUser(userData);
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [chatManager, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      setError(null);

      // First create the group
      const group = await createGroup(user.id, formData);

      // Then add members if any
      if (members.length > 0) {
        await Promise.all(
          members.map((member) => addGroupMember(user.id, group._id, member.id))
        );
      }

      // Invalidate the groups cache after creating a new group
      chatManager.invalidateCache();

      router.push("/chat");
    } catch (err) {
      console.error("Failed to create group:", err);
      setError("Failed to create group. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMember = (member: Member) => {
    if (members.some((m) => m.id === member.id)) {
      setError("This user is already added to the group");
      return;
    }
    setMembers((prev) => [...prev, member]);
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="px-4 py-2 flex items-center">
            <div className="text-lg font-semibold">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-2 flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Create New Group</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Group Name
          </label>
          <input
            type="text"
            id="name"
            required
            maxLength={50}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Members (Optional)
          </label>
          <MemberSearch onAddMember={handleAddMember} />
          <MemberList members={members} onRemoveMember={handleRemoveMember} />
        </div>

        <button
          type="submit"
          disabled={submitting || !formData.name.trim()}
          className="w-full rounded-full bg-green-500 px-4 py-2 text-white font-medium hover:bg-green-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
}
