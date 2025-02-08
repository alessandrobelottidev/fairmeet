import { MeetupCreationProvider } from "@/context/meetup-creation-context";
import { CreationProgress } from "@/components/meetup-creation/CreationProgress";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MeetupCreationProvider>
      <div className="min-h-screen relative">
        <div className="bg-white min-h-[calc(_100vh_-_30px_)] max-h-[calc(_100vh_-_30px_)] sm:min-h-[calc(_100vh_-_92px_)] sm:max-h-[calc(_100vh_-_92px_)] overflow-y-scroll">
          {children}
        </div>
        <footer className="absolute bottom-0 sm:bottom-[62px] left-0 right-0 z-50 pb-4 pt-2 bg-white">
          <CreationProgress />
        </footer>
      </div>
    </MeetupCreationProvider>
  );
}
