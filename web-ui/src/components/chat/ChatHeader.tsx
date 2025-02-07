import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ChatHeaderProps {
  title: string;
  refreshButtonId?: string; // For client hydration
  createButtonLink?: string;
  refreshing?: boolean;
}

export function ChatHeader({
  title,
  refreshButtonId,
  createButtonLink,
  refreshing = false,
}: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="px-4 py-2 flex justify-between items-center">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex gap-2">
          {refreshButtonId && (
            <div id={refreshButtonId}>
              <button
                className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Refresh"
              >
                <RefreshCw
                  size={20}
                  className={`text-gray-600 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          )}
          {createButtonLink && (
            <Link
              href={createButtonLink}
              className="h-8 w-8 flex justify-center items-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
              aria-label="Create new"
            >
              <Plus size={24} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
