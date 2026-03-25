import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import PostCard from './../../components/PostCard/PostCard';
import { getAllPosts } from '../../service/PostApi';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import CreatePost from '../../components/CreatePost/CreatePost';
import { GetUserData } from '../../service/LoginApi';
import { Helmet } from 'react-helmet';
import { FaSpinner } from 'react-icons/fa';

function Home() {
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(null);
  
  // React Query for fetching posts
  const { 
    data: postsData, 
    isLoading: postsLoading, 
    isError: postsError,
    error: postsErrorDetails,
    refetch: refetchPosts,
    isFetching
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getAllPosts(),
    staleTime: 1000 * 60, // 1 minute
    cacheTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
  
  // React Query for fetching user data
  const { 
    data: userDataResponse,
    isLoading: userLoading 
  } = useQuery({
    queryKey: ['userData'],
    queryFn: () => GetUserData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
  
  // Extract posts from response
  const allPosts = postsData?.data?.posts || postsData?.posts || [];
  
  // Set user data when available
  useEffect(() => {
    if (userDataResponse?.data) {
      setUserData(userDataResponse.data.user);
    } else if (userDataResponse?.user) {
      setUserData(userDataResponse.user);
    }
  }, [userDataResponse]);
  
  // Function to refresh posts (called after creating/updating posts)
  const handleRefreshPosts = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };
  
  // Loading state
  if (postsLoading || userLoading) {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Home - Loading</title>
        </Helmet>
        <LoadingPage />
      </>
    );
  }
  
  // Error state
  if (postsError) {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Home - Error</title>
        </Helmet>
        <div className="min-h-screen container flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">
              Failed to load posts: {postsErrorDetails?.message || 'Something went wrong'}
            </p>
            <button 
              onClick={() => refetchPosts()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home - Social Feed</title>
        <meta name="description" content="Browse and interact with posts from your network" />
      </Helmet>
      
      <div className='min-h-screen container px-2 md:px-10 lg:px-20 xl:px-56 flex flex-col items-center py-4'>
        {/* Create Post Component */}
        <CreatePost callback={handleRefreshPosts} />
        
        {/* Refresh Indicator */}
        {isFetching && (
          <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-3 py-2 flex items-center gap-2 z-50">
            <FaSpinner className="animate-spin text-primary" />
            <span className="text-sm text-gray-600">Refreshing posts...</span>
          </div>
        )}
        
        {/* Posts Feed */}
        {allPosts?.length > 0 ? (
          <div className="w-full">
            {allPosts?.map((post) => (
              <PostCard 
                key={post._id || post.id} 
                post={post} 
                allComment={false} 
                callback={handleRefreshPosts} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts yet. Be the first to create a post!</p>
          </div>
        )}
      </div>
    </>
  )
}

export default Home