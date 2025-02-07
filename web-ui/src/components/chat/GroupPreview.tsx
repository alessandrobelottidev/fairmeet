import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { GroupMetadata, useChatManager } from "@/hooks/useChatManager";

interface GroupPreviewProps {
  groupId: string;
  userId: string;
  onClick?: () => void;
}

export function GroupPreview({ groupId, userId, onClick }: GroupPreviewProps) {
  const chatManager = useChatManager(userId);
  const [metadata, setMetadata] = useState<GroupMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // This will use the metadata cache internally
        const data = await chatManager.getGroupMetadata(groupId);
        setMetadata(data);
      } catch (error) {
        console.error("Failed to fetch group metadata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [groupId, chatManager]);

  if (loading || !metadata) {
    return (
      <div className="h-[68px] flex items-center px-4 animate-pulse">
        <div className="w-full space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[68px] flex flex-col justify-center items-center">
      <button
        onClick={onClick}
        className="w-full h-full text-left px-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {metadata.name}
            </h3>
            {metadata.description && (
              <p className="text-sm text-gray-500 truncate">
                {metadata.description}
              </p>
            )}
          </div>
          <div className="flex items-center ml-4 text-sm text-gray-600 bg-gray-200 py-1 px-2 rounded-xl">
            <Users size={16} className="mr-1" />
            <span>{metadata.memberCount}</span>
          </div>
        </div>
      </button>
    </div>
  );
}
