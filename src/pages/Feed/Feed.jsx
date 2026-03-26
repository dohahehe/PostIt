// pages/Feed/Feed.jsx
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaSpinner } from 'react-icons/fa';
import { Button } from "@heroui/react";
import PostCard from '../../components/PostCard/PostCard';
import { getHomeFeed } from '../../service/PostApi';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import CreatePost from '../../components/CreatePost/CreatePost';

function Feed() {
  const [cursor, setCursor] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['home-feed', cursor],
    queryFn: () => getHomeFeed(10, cursor),
    staleTime: 1000 * 30,
    keepPreviousData: true,
  });
  
  useEffect(() => {
    if (data) {
      const newPosts = data?.data?.posts || data?.posts || [];
      const cursorData = data?.data?.nextCursor || data?.nextCursor;
      
      if (cursor === null) {
        setAllPosts(newPosts);
      } else {
        setAllPosts(prev => [...prev, ...newPosts]);
      }
      setNextCursor(cursorData);
    }
  }, [data, cursor]);
  
  const loadMore = () => {
    if (nextCursor) setCursor(nextCursor);
  };
  
  if (isLoading && cursor === null) return <LoadingPage />;
  
  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <p className="text-red-500">Failed to load feed</p>
        <button onClick={() => refetch()} className="text-blue-500 mt-2">Try again</button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet><title>Your Feed</title></Helmet>
      
      {isFetching && (
        <div className="fixed top-20 right-8 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 z-50">
          <FaSpinner className="animate-spin text-blue-500" />
          <span className="text-sm">Refreshing...</span>
        </div>
      )}

      <CreatePost />

      {allPosts.length > 0 ? (
        <div className="space-y-4">
          {allPosts.map((post) => (
            <PostCard key={post._id || post.id} post={post} allComment={false} callback={() => refetch()} />
          ))}
          
          {nextCursor && (
            <div className="flex justify-center pt-4">
              <Button onClick={loadMore} isLoading={isFetching} variant="bordered">
                Load more
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-gray-500">No posts in your feed</p>
          <p className="text-sm text-gray-400 mt-1">Follow people to see their posts</p>
        </div>
      )}
    </>
  );
}

export default Feed;