export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-6" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
