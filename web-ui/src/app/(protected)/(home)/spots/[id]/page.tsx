import { PlaceDetails } from "@/components/places/PlaceDetails";
import { authFetch } from "@/lib/fetch";
import { IPlace } from "@fairmeet/rest-api";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const data = (await authFetch(`/v1/spots/${id}`, {
    method: "GET",
  })) as IPlace[];

  return <PlaceDetails place={data} />;
}
