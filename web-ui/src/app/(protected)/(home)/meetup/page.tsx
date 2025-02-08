import { IMeeting, MeetingsProvider } from "@/context/meetings-context";
import { MeetingsView } from "@/components/meetings/MeetingView";
import { getCurrentUser } from "@/lib/auth";
import { authFetch } from "@/lib/fetch";

export default async function MeetingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const initialMeetings = await authFetch<IMeeting[]>("/v1/meetings");

  return (
    <MeetingsProvider
      initialMeetings={initialMeetings}
      userId={user.id}
      userHandle={user.handle}
    >
      <div className="p-4">
        <h1 className="text-lg font-semibold mb-1">Ritrovi</h1>
        <p className="text-sm">
          Da qui puoi visualizzare ed interagire con i ritrovi creati da te o
          dai membri dei vari gruppi di cui fai parte.
        </p>
      </div>
      <div className="h-full max-h-[calc(_100vh_-_174px_)] overflow-y-scroll pt-2 pb-5">
        <MeetingsView />
      </div>
    </MeetingsProvider>
  );
}
