import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { FaSpinner, FaBookmark } from 'react-icons/fa';
import PostCard from '../../components/PostCard/PostCard';
import { getBookmarks } from '../../service/PostApi';
import LoadingPage from '../../components/LoadingPage/LoadingPage';

function Bookmarks() {
  const { 
    data, 
    isLoading, 
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => getBookmarks(),
    staleTime: 1000 * 60,
  });
  console.log(data);
  
  const bookmarkedPosts = data?.data?.bookmarks || data?.posts || [];
  
  if (isLoading) return <LoadingPage />;
  
  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <p className="text-red-500 mb-4">Failed to load bookmarks</p>
        <button 
          onClick={() => refetch()}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Try again →
        </button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Bookmarks</title>
      </Helmet>
      
      <div>
        {/* Refresh Indicator */}
        {isFetching && (
          <div className="fixed top-20 right-8 bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-4 py-2 flex items-center gap-2 z-50">
            <FaSpinner className="animate-spin text-blue-500" />
            <span className="text-sm text-gray-600">Refreshing...</span>
          </div>
        )}
        
        {bookmarkedPosts.length > 0 ? (
          <div className="space-y-4">
            {bookmarkedPosts.map((post) => (
              <PostCard 
                key={post._id || post.id} 
                post={post} 
                allComment={false} 
                callback={() => refetch()} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FaBookmark className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No bookmarks yet</p>
            <p className="text-sm text-gray-400">Save posts you want to read later</p>
            <button 
              onClick={() => window.location.href = '/home/explore'}
              className="mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Explore posts →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Bookmarks;