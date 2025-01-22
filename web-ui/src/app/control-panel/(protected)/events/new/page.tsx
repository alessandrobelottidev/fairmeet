import { ResourceForm } from "@/components/forms/ResourceForm";

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

export default function NewEventPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create New Event</h1>
        <p className="text-gray-600">Fill in the details for your new event.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm fields={eventFields} resourceType="events" />
      </div>
    </div>
  );
}
