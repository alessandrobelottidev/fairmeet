import { ResourceForm } from "@/components/forms/ResourceForm";
import { authFetch } from "@/lib/fetch";
import { notFound } from "next/navigation";

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
}

const eventFields = [
  { name: "title", label: "Title", type: "text" as const, required: true },
  { name: "address", label: "Address", type: "text" as const, required: true },
  {
    name: "latitude",
    label: "Latitude",
    type: "number" as const,
    required: true,
  },
  {
    name: "longitude",
    label: "Longitude",
    type: "number" as const,
    required: true,
  },
  {
    name: "startDateTimeZ",
    label: "Start Date and Time",
    type: "datetime-local" as const,
    required: true,
  },
  {
    name: "endDateTimeZ",
    label: "End Date and Time",
    type: "datetime-local" as const,
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea" as const,
    required: true,
    rows: 4,
  },
  {
    name: "abstract",
    label: "Abstract",
    type: "textarea" as const,
    required: true,
    rows: 2,
  },
  { name: "email", label: "Contact Email", type: "email" as const },
  {
    name: "featuredImageUrl",
    label: "Featured Image URL",
    type: "url" as const,
  },
];

async function getEvent(id: string) {
  try {
    const event = await authFetch<Event>(`/v1/events/${id}`);
    return event;
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const initialData = {
    ...event,
    latitude: event.location.coordinates[1],
    longitude: event.location.coordinates[0],
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Edit Event</h1>
        <p className="text-gray-600">Update the event details.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm
          fields={eventFields}
          resourceType="events"
          initialData={initialData}
          isEditing={true}
          resourceId={id}
        />
      </div>
    </div>
  );
}
