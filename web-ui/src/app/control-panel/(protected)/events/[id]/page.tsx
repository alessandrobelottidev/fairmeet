import { authFetch } from "@/lib/fetch";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Event {
  _id: string;
  title: string;
  address: string;
  description: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  startDateTimeZ: string;
  endDateTimeZ: string;
  abstract: string;
  email?: string;
  socialMediaHandles?: Record<string, string>;
  featuredImageUrl?: string;
  updated_at: string;
}

async function getEvent(id: string) {
  try {
    const event = await authFetch<Event>(`/v1/events/${id}`);
    return event;
  } catch {
    return null;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {event.featuredImageUrl && (
          <div className="h-64 overflow-hidden">
            <img
              src={event.featuredImageUrl}
              alt={event.title}
              className="w-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <Link
              href={`/control-panel/events/${event._id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Event
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Time</h2>
              <p>Start: {formatDate(event.startDateTimeZ)}</p>
              <p>End: {formatDate(event.endDateTimeZ)}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Location</h2>
              <p>{event.address}</p>
              <p className="text-sm text-gray-600">
                ({event.location.coordinates[1]},{" "}
                {event.location.coordinates[0]})
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Abstract</h2>
            <p className="text-gray-700">{event.abstract}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {(event.email || event.socialMediaHandles) && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Contact</h2>
              {event.email && (
                <p className="text-gray-700">Email: {event.email}</p>
              )}
              {event.socialMediaHandles &&
                Object.entries(event.socialMediaHandles).map(
                  ([platform, handle]) => (
                    <p key={platform} className="text-gray-700 capitalize">
                      {platform}: {handle}
                    </p>
                  )
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
