import Button from "@/components/bottomsheet/Button";
import { getCurrentUser } from "@/lib/auth";
import { Suspense } from "react";

export default async function ProfilePage() {
  return (
    <div className="p-4">
      <div className="card p-4 bg-white rounded-2xl shadow-md border border-slate-300">
        <h1 className="text-lg font-semibold mb-1">Profilo personale</h1>
        <p className="mb-4 text-sm">
          Da qui puoi visualizzare i tuoi dati personali
        </p>
        <div className="mb-4">
          <Suspense fallback={<UserSkeleton />}>
            <UserData />
          </Suspense>
        </div>

        <div className="flex flex-row gap-2">
          <Button title="Logout" href={"/logout"} variant="secondary" />
          <Button
            title="Elimina account"
            href={"mailto:delete-account@fairmeet.com"}
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
}

async function UserData() {
  const user = await getCurrentUser();

  if (!user) return <></>;

  return (
    <div className="space-y-2">
      <p>
        <span className="font-semibold mr-1 text-sm w-full block">ID:</span>
        {user.id}
      </p>
      <p>
        <span className="font-semibold mr-1 text-sm w-full block">Ruolo:</span>
        {user.role}
      </p>
      <p>
        <span className="font-semibold mr-1 text-sm w-full block">Handle:</span>
        {user.handle}
      </p>
      <p>
        <span className="font-semibold mr-1 text-sm w-full block">Email:</span>
        {user.email}
      </p>
    </div>
  );
}

async function UserSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <p>
        <span className="font-semibold mr-1 text-sm w-full block">ID:</span>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </p>
      <p>
        <span className="font-semibold mr-1 text-sm w-full block">Ruolo:</span>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </p>
      <p>
        <span className="font-semibold mr-1 text-sm w-full block">Handle:</span>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </p>
      <p>
        <span className="font-semibold mr-1 text-sm w-full block">Email:</span>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </p>
    </div>
  );
}
