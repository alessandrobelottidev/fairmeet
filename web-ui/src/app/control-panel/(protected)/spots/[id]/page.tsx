import { authFetch } from "@/lib/fetch";
import { notFound } from "next/navigation";
import Link from "next/link";

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
  updated_at: string;
}

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

export default async function SpotPage({ params }: PageProps) {
  const resolvedParams = await params;
  const spot = await getSpot(resolvedParams.id);

  if (!spot) notFound();

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {spot.featuredImageUrl && (
          <div className="h-64 overflow-hidden">
            <img
              src={spot.featuredImageUrl}
              alt={spot.title}
              className="w-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-4">{spot.title}</h1>
            <Link
              href={`/control-panel/spots/${spot._id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Spot
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Location</h2>
              <p>{spot.address}</p>
              <p className="text-sm text-gray-600">
                ({spot.latitude}, {spot.longitude})
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Abstract</h2>
            <p className="text-gray-700">{spot.abstract}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {spot.description}
            </p>
          </div>

          {(spot.email || spot.socialMediaHandles) && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Contact</h2>
              {spot.email && (
                <p className="text-gray-700">Email: {spot.email}</p>
              )}
              {spot.socialMediaHandles &&
                Object.entries(spot.socialMediaHandles).map(
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
