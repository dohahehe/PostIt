// components/LoadingPage/LoadingPage.jsx
export default function LoadingPage() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-11/12" />
            <div className="h-4 bg-gray-200 rounded w-10/12" />
          </div>
          
          {/* Image placeholder */}
          <div className="h-64 bg-gray-200 rounded-xl mb-3" />
          
          {/* Actions */}
          <div className="flex gap-4 pt-2 border-t border-gray-100">
            <div className="h-8 w-16 bg-gray-200 rounded" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}