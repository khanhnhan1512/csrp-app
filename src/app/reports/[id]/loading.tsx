export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-6 animate-pulse">
            <div className="h-5 w-1/3 bg-gray-200 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
              <div className="h-4 w-4/6 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
