// pages/Explore/Explore.jsx
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { FaSpinner } from 'react-icons/fa';
import PostCard from '../../components/PostCard/PostCard';
import { getAllPosts } from '../../service/PostApi';
import LoadingPage from '../../components/LoadingPage/LoadingPage';

function Explore() {
  const { 
    data, 
    isLoading, 
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: ['explore-posts'],
    queryFn: () => getAllPosts(1, 20),
    staleTime: 1000 * 60,
  });
  
  const allPosts = data?.data?.posts || data?.posts || [];
  
  if (isLoading) return <LoadingPage />;
  
  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <p className="text-red-500">Something went wrong</p>
        <button onClick={() => refetch()} className="text-blue-500 mt-2">Try again</button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet><title>Explore</title></Helmet>
      
      {isFetching && (
        <div className="fixed top-20 right-8 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 z-50">
          <FaSpinner className="animate-spin text-blue-500" />
          <span className="text-sm">Refreshing...</span>
        </div>
      )}
      
      {allPosts.length > 0 ? (
        <div className="space-y-4">
          {allPosts.map((post) => (
            <PostCard key={post._id || post.id} post={post} allComment={false} callback={() => refetch()} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-gray-500">No posts yet</p>
        </div>
      )}
    </>
  );
}

export default Explore;