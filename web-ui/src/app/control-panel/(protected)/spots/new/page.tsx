import { ResourceForm } from "@/components/forms/ResourceForm";

const spotFields = [
  { name: "title", label: "Title", type: "text" as const, required: true },
  { name: "address", label: "Address", type: "text" as const, required: true },
  {
    name: "description",
    label: "Description",
    type: "textarea" as const,
    required: true,
    rows: 4,
  },
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

export default function NewSpotPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create New Spot</h1>
        <p className="text-gray-600">Fill in the details for your new spot.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm fields={spotFields} resourceType="spots" />
      </div>
    </div>
  );
}
