export function MeetingCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>

      {/* Map skeleton */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />

      {/* Places list skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
              <div className="h-2 w-full bg-gray-200 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
