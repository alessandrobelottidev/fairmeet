"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { clientFetch } from "@/lib/client-fetch";
import { getGroupDetails } from "@/app/actions/chat";

export default function GroupSettingsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user } = useAuth();

  const [group, setGroup] = useState<{
    _id: string;
    name: string;
    description?: string;
    createdBy: string;
    members: { _id: string; name: string }[];
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch group details
  useEffect(() => {
    async function fetchGroupDetails() {
      if (!user?.id || !params.id) return;

      try {
        const groupDetails = await getGroupDetails(user.id, params.id);
        setGroup(groupDetails);
        setFormData({
          name: groupDetails.name,
          description: groupDetails.description || "",
        });
      } catch (err) {
        setError("Failed to load group details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGroupDetails();
  }, [user?.id, params.id]);

  // Determine user's role in the group
  const isMember = group?.members.some(
    (member) => member._id.toString() === user?.id
  );
  const isCreator = group?.createdBy.toString() === user?.id;

  // If user is not a member, redirect or show error
  useEffect(() => {
    if (!loading && !isMember) {
      router.push("/chat");
    }
  }, [isMember, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCreator || !user?.id) return;

    try {
      setLoading(true);
      await clientFetch(`/v1/users/${user.id}/groups/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      });

      // Update local state
      if (group) {
        setGroup((prev) => (prev ? { ...prev, ...formData } : null));
      }
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update group");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (
      !isCreator ||
      !user?.id ||
      !confirm(
        "Are you sure you want to delete this group? This action cannot be undone."
      )
    )
      return;

    try {
      setLoading(true);
      await clientFetch(`/v1/users/${user.id}/groups/${params.id}`, {
        method: "DELETE",
      });
      router.push("/chat");
    } catch (err) {
      setError("Failed to delete group");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle removal of a member
  const removeMember = async (memberId: string) => {
    if (!isCreator || !user?.id) return;

    try {
      setLoading(true);
      await clientFetch(
        `/v1/users/${user.id}/groups/${params.id}/members/${memberId}`,
        {
          method: "DELETE",
        }
      );
      // Refresh group details
      const updatedGroup = await getGroupDetails(user.id, params.id);
      setGroup(updatedGroup);
    } catch (err) {
      setError("Failed to remove member");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading group details...</p>
      </div>
    );
  }

  // No group found or user not a member
  if (!group || !isMember) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">
          Group not found or you are not a member.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold flex-1">Group Details</h1>
          {isCreator && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Edit size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 m-4">
          {error}
        </div>
      )}

      {/* Group Details Form */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* ... (editing form remains the same) ... */}
        </form>
      ) : (
        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Group Name</h2>
            <p className="text-gray-700">{group.name}</p>
          </div>

          {group.description && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Description</h2>
              <p className="text-gray-700">{group.description}</p>
            </div>
          )}

          {/* Members List */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Group Members</h2>
            {group.members.map((member) => (
              <div
                key={member._id}
                className="flex justify-between items-center p-2 border-b border-gray-200"
              >
                <span>{member.name}</span>
                {isCreator && member._id !== user?.id && (
                  <button
                    onClick={() => removeMember(member._id)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Deletion for Group Creator */}
          {isCreator && (
            <div className="mt-6">
              <button
                onClick={handleDeleteGroup}
                className="w-full rounded-md bg-red-500 px-4 py-2 text-white font-medium hover:bg-red-600 focus:outline-none flex items-center justify-center"
              >
                <Trash2 size={20} className="mr-2" />
                Delete Group
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
