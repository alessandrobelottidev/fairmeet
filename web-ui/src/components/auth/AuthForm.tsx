import { SubmitButton } from "./SubmitButton";
import type { ReactNode } from "react";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface AuthFormProps {
  title: string;
  subtitle?: string;
  fields: Field[];
  action: (formData: FormData) => Promise<void>;
  submitText: string;
  error?: string | null;
  children?: ReactNode;
}

export function AuthForm({
  title,
  subtitle,
  fields,
  action,
  submitText,
  error,
  children,
}: AuthFormProps) {
  return (
    <>
      <div className="mb-6">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form action={action} className="space-y-4">
        <div className="rounded-md shadow-sm">
          {fields.map((field, index) => (
            <div key={field.name} className={index > 0 ? "mt-2" : ""}>
              <label htmlFor={field.name} className="sr-only">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required !== false}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder={field.label}
              />
            </div>
          ))}
        </div>

        <div>
          <SubmitButton>{submitText}</SubmitButton>
        </div>

        {children}
      </form>
    </>
  );
}
