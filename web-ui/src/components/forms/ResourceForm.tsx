"use client";

import { clientFetch } from "@/lib/client-fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "email" | "url" | "number" | "datetime-local";
  required?: boolean;
  rows?: number;
}

interface ResourceFormProps {
  fields: Field[];
  resourceType: "events" | "spots";
  initialData?: Record<string, any>;
  isEditing?: boolean;
  resourceId?: string;
  onSuccess?: () => void;
}

export function ResourceForm({
  fields,
  resourceType,
  initialData,
  isEditing,
  resourceId,
  onSuccess,
}: ResourceFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};

    fields.forEach((field) => {
      const value = formData.get(field.name);
      if (value !== "") {
        if (field.type === "datetime-local") {
          // Convert to ISO 8601 with timezone
          const date = new Date(value as string);
          data[field.name] = date.toISOString();
        } else {
          data[field.name] = value;
        }
      }
    });

    // Handle location separately if coordinates exist
    if (formData.get("latitude") && formData.get("longitude")) {
      data.location = {
        type: "Point",
        coordinates: [
          parseFloat(formData.get("longitude") as string),
          parseFloat(formData.get("latitude") as string),
        ],
      };
    }

    try {
      if (isEditing && resourceId) {
        await clientFetch(`/v1/${resourceType}/${resourceId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await clientFetch(`/v1/${resourceType}`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
      }

      onSuccess?.();
      router.push(`/control-panel/${resourceType}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.type === "textarea" ? "md:col-span-2" : ""}
          >
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label} {field.required && "*"}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                id={field.name}
                required={field.required}
                defaultValue={initialData?.[field.name]}
                rows={field.rows || 4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                required={field.required}
                defaultValue={initialData?.[field.name]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : isEditing
            ? `Update ${resourceType.slice(0, -1)}`
            : `Create ${resourceType.slice(0, -1)}`}
        </button>
      </div>
    </form>
  );
}
