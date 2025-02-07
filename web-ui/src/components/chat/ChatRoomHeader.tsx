import { IGroup } from "@fairmeet/rest-api";
import { ArrowLeft, RefreshCw, Settings } from "lucide-react";

interface ChatRoomHeaderProps {
  group?: IGroup | null;
  user?: { id: string };
  onBack: () => void;
  onRefresh: () => void;
  onSettings: () => void;
  refreshing?: boolean;
}

export default function ChatRoomHeader({
  group,
  user,
  onBack,
  onRefresh,
  onSettings,
  refreshing,
}: ChatRoomHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="px-4 py-2 flex items-center">
        <button
          onClick={onBack}
          className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-100 transition-colors mr-2"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex flex-row justify-between items-center pr-4">
          <h1 className="text-lg font-semibold">
            {group?.name || "Loading..."}
          </h1>
          <p className="text-sm text-gray-500">
            {group ? `${group.members.length + 1} members` : "..."}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
          </button>
          {group && user && group.createdBy.toString() === user.id && (
            <button
              onClick={onSettings}
              className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Settings size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
