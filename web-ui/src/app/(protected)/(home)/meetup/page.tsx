import { IMeeting, MeetingsProvider } from "@/context/meetings-context";
import { MeetingsView } from "@/components/meetings/MeetingView";
import { getCurrentUser } from "@/lib/auth";
import { authFetch } from "@/lib/fetch";

export default async function MeetingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const initialMeetings = await authFetch<IMeeting[]>("/v1/meetings");

  return (
    <MeetingsProvider initialMeetings={initialMeetings} userId={user.id}>
      <MeetingsView />
    </MeetingsProvider>
  );
}
