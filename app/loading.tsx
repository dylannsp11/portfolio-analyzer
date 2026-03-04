export default function Loading() {
  return (
    <main className="min-h-screen bg-black p-8 font-sans">
      <div className="max-w-7xl mx-auto animate-pulse">
        
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-8">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-zinc-900 rounded-md"></div>
            <div className="h-4 w-48 bg-zinc-900 rounded-md"></div>
          </div>
          <div className="h-10 w-80 bg-zinc-900 rounded-md hidden md:block"></div>
        </div>

        {/* 2-Column Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column Skeleton */}
          <div className="lg:col-span-5 space-y-8">
            <div className="h-32 w-full bg-zinc-900/50 rounded-xl border border-zinc-800/50"></div>
            <div className="h-[450px] w-full bg-zinc-900/50 rounded-xl border border-zinc-800/50"></div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-7">
            <div className="h-6 w-40 bg-zinc-900 rounded-md mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Generates 6 dummy skeleton cards */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-36 w-full bg-zinc-900/50 rounded-xl border border-zinc-800/50"></div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}