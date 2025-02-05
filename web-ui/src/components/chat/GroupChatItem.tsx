import { Users } from "lucide-react";
import type { IGroup } from "@fairmeet/rest-api";

interface GroupChatItemProps {
  group: IGroup;
  onClick?: () => void;
}

const GroupChatItem = ({
  group: { name, description, members },
  onClick,
}: GroupChatItemProps) => {
  return (
    <div className="h-[68px] flex flex-col justify-center items-center">
      <button
        onClick={onClick}
        className="w-full h-full text-left px-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-gray-500 truncate">{description}</p>
            )}
          </div>
          <div className="flex items-center ml-4 text-sm text-gray-600 bg-gray-200 py-1 px-2 rounded-xl">
            <Users size={16} className="mr-1" />
            <span>{members.length + 1}</span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default GroupChatItem;
