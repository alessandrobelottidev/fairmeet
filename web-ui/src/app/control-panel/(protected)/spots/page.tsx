import { DataTable } from "@/components/ui/table";
import { authFetch } from "@/lib/fetch";
import Link from "next/link";

interface Spot {
  _id: string;
  title: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  abstract: string;
  updated_at: string;
}

interface SpotsResponse {
  data: Spot[];
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
  {
    key: "title" as const,
    label: "Title",
    sortable: true,
    type: "text" as const,
  },
  {
    key: "address" as const,
    label: "Address",
    sortable: true,
    type: "text" as const,
  },
  {
    key: "abstract" as const,
    label: "Abstract",
    sortable: false,
    type: "text" as const,
  },
  {
    key: "updated_at" as const,
    label: "Last Updated",
    sortable: true,
    type: "datetime" as const,
  },
];

function getParamValue(
  value: string | string[] | undefined,
  defaultValue: string
): string {
  if (Array.isArray(value)) return value[0];
  return value || defaultValue;
}

async function getSpots(params: {
  [key: string]: string | string[] | undefined;
}) {
  return authFetch<SpotsResponse>("/v1/spots", {
    params: {
      page: getParamValue(params.page, "0"),
      limit: getParamValue(params.limit, "10"),
      sortBy: getParamValue(params.sortBy, "updated_at"),
      order: getParamValue(params.order, "desc"),
    },
  });
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SpotsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, pagination } = await getSpots(params);
  const order = getParamValue(params.order, "desc") as "asc" | "desc";
  const sortBy = getParamValue(params.sortBy, "updated_at");

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Spots</h1>
        <Link
          href="/control-panel/spots/new"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Create Spot
        </Link>
      </div>

      <DataTable<Spot>
        data={data}
        columns={columns}
        pagination={pagination}
        sortBy={sortBy}
        order={order}
      />
    </div>
  );
}
