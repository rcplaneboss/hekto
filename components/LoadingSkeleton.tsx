export default function LoadingSkeleton() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#101010] transition-colors duration-300">
      
      {/* 1. Navbar Simulation */}
      <div className="w-full h-16 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sm:px-20">
        <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="hidden md:flex gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
        <div className="w-32 h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      {/* 2. Hero Section Skeleton */}
      <div className="w-full bg-[#F2F0FF]/50 dark:bg-[#151875]/20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="w-32 h-4 bg-[#FB2E86]/20 rounded-full animate-pulse" />
            <div className="w-3/4 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-1/2 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-32 h-10 bg-[#FB2E86]/20 rounded mt-4 animate-pulse" />
          </div>
          <div className="w-full h-[300px] md:h-[400px] bg-gray-200 dark:bg-gray-800 rounded-full opacity-50 animate-pulse mx-auto" />
        </div>
      </div>

      {/* 3. Product Grid Skeleton (Featured Products) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-12 animate-pulse" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
              {/* Product Image Area */}
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              {/* Product Details Area */}
              <div className="p-4 space-y-3 bg-white dark:bg-[#151875]/10">
                <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
                <div className="flex justify-center gap-2">
                  <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}