"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  type?: "datetime" | "text";
}

interface PaginationInfo {
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface DataTableProps<T extends { _id: string }> {
  data: T[];
  columns: Column<T>[];
  pagination: PaginationInfo;
  sortBy?: string;
  order?: "asc" | "desc";
}

export function DataTable<T extends { _id: string }>({
  data,
  columns,
  pagination,
  sortBy: initialSortBy,
  order: initialOrder = "desc",
}: DataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      }

      return current.toString();
    },
    [searchParams]
  );

  const handleSort = (columnKey: keyof T) => {
    if (!columns.find((col) => col.key === columnKey)?.sortable) return;

    const newOrder =
      initialSortBy === columnKey && initialOrder === "desc" ? "asc" : "desc";

    router.push(
      `${pathname}?${createQueryString({
        sortBy: columnKey as string,
        order: newOrder,
      })}`,
      { scroll: false }
    );
  };

  const handlePageChange = (page: number) => {
    router.push(`${pathname}?${createQueryString({ page })}`, {
      scroll: false,
    });
  };

  const handleView = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`${pathname}/${id}/edit`);
  };

  const formatCellValue = (value: any, type?: string) => {
    if (type === "datetime") {
      return new Date(value).toLocaleString();
    }
    return String(value);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && initialSortBy === column.key && (
                      <span className="text-gray-400">
                        {initialOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={`${row._id}-${column.key as string}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {formatCellValue(row[column.key], column.type)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleView(row._id)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(row._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between w-full">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {pagination.currentPage * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                (pagination.currentPage + 1) * pagination.limit,
                pagination.totalDocs
              )}
            </span>{" "}
            of <span className="font-medium">{pagination.totalDocs}</span>{" "}
            results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pagination.hasPrevPage
                  ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pagination.hasNextPage
                  ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
