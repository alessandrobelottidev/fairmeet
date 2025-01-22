import { ResourceForm } from "@/components/forms/ResourceForm";
import { authFetch } from "@/lib/fetch";
import { notFound } from "next/navigation";

interface Spot {
  _id: string;
  title: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  abstract: string;
  email?: string;
  socialMediaHandles?: Record<string, string>;
  featuredImageUrl?: string;
}

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

async function getSpot(id: string) {
  if (!id) return null;

  try {
    const spots = await authFetch<Spot[]>(`/v1/spots/${id}`);
    return spots[0] || null;
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSpotPage({ params }: PageProps) {
  const resolvedParams = await params;
  const spot = await getSpot(resolvedParams.id);

  if (!spot) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Edit Spot</h1>
        <p className="text-gray-600">Update the spot details.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm
          fields={spotFields}
          resourceType="spots"
          initialData={spot}
          isEditing={true}
          resourceId={resolvedParams.id}
        />
      </div>
    </div>
  );
}
