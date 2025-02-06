"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { searchUserByHandle } from "@/app/actions/chat";

interface Member {
  id: string;
  handle: string;
}

interface MemberSearchProps {
  onAddMember: (member: Member) => void;
}

export function MemberSearch({ onAddMember }: MemberSearchProps) {
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!handle.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const user = await searchUserByHandle(handle);

      if (user) {
        onAddMember({
          id: user.id,
          handle: user.handle,
        });
        setHandle("");
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("Failed to search for user");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && handle.trim() && !loading) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1">
        <input
          type="text"
          value={handle}
          onChange={(e) => {
            setHandle(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter user handle"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
      <button
        type="button"
        onClick={handleSearch}
        disabled={loading || !handle.trim()}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
