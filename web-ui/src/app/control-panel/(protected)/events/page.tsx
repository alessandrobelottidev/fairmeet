import { DataTable } from "@/components/ui/table";
import { authFetch } from "@/lib/fetch";
import Link from "next/link";

interface Event {
  _id: string;
  title: string;
  address: string;
  startDateTimeZ: string;
  endDateTimeZ: string;
  abstract: string;
  updated_at: string;
}

interface EventsResponse {
  data: Event[];
  pagination: {
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

const columns = [
  { key: "title" as const, label: "Title", sortable: true },
  { key: "address" as const, label: "Address", sortable: true },
  { key: "startDateTimeZ" as const, label: "Start Date", sortable: true },
  { key: "endDateTimeZ" as const, label: "End Date", sortable: true },
  { key: "abstract" as const, label: "Abstract", sortable: false },
  { key: "updated_at" as const, label: "Last Updated", sortable: true },
];

function getParamValue(
  value: string | string[] | undefined,
  defaultValue: string
): string {
  if (Array.isArray(value)) return value[0];
  return value || defaultValue;
}

async function getEvents(params: {
  [key: string]: string | string[] | undefined;
}) {
  return authFetch<EventsResponse>("/v1/events", {
    params: {
      page: getParamValue(params.page, "0"),
      limit: getParamValue(params.limit, "10"),
      sortBy: getParamValue(params.sortBy, "startDateTimeZ"),
      order: getParamValue(params.order, "desc"),
    },
  });
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, pagination } = await getEvents(params);
  const order = getParamValue(params.order, "desc") as "asc" | "desc";
  const sortBy = getParamValue(params.sortBy, "startDateTimeZ");

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Link
          href="/control-panel/events/new"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Create Event
        </Link>
      </div>

      <DataTable
        data={data}
        columns={columns}
        pagination={pagination}
        sortBy={sortBy}
        order={order}
      />
    </div>
  );
}
