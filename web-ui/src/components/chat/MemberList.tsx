import { X } from "lucide-react";

interface Member {
  id: string;
  handle: string;
}

interface MemberListProps {
  members: Member[];
  onRemoveMember: (id: string) => void;
}

export function MemberList({ members, onRemoveMember }: MemberListProps) {
  if (members.length === 0) return null;

  return (
    <ul className="space-y-2 mt-4">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex items-center justify-between p-2 rounded-md bg-gray-50"
        >
          <span>{member.handle}</span>
          <button
            onClick={() => onRemoveMember(member.id)}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
