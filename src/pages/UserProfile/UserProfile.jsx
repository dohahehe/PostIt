import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { useContext, useState } from 'react';
import { Avatar, Button } from "@heroui/react";
import { FaUser, FaCalendar, FaMapMarker, FaLink, FaUserPlus, FaUserCheck, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { getUserPosts } from '../../service/PostApi';
import PostCard from '../../components/PostCard/PostCard';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import toast from 'react-hot-toast';
import { getUserProfile } from '../../service/LoginApi';
import { followUser } from '../../service/FollowApi';

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  
  const isOwnProfile = userData?._id === userId;
  
  // Fetch user profile
  const { 
    data: profileData, 
    isLoading: profileLoading, 
    isError: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
  
  // Fetch user posts
  const { 
    data: postsData, 
    isLoading: postsLoading,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
  
  const user = profileData?.data?.user || profileData?.user || {};
  const userPosts = postsData?.data?.posts || postsData?.posts || [];
  const isFollowing = user?.isFollowing || false;
  const followersCount = user?.followersCount || 0;
  const followingCount = user?.followingCount || 0;
  const postsCount = user?.postsCount || userPosts.length;
  
  // Follow/Unfollow mutation (PUT toggles both)
  const followMutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: (data) => {
      if (data?.message === 'success') {
        const newFollowState = !isFollowing;
        toast.success(newFollowState ? `Following ${user?.name}` : `Unfollowed ${user?.name}`);
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        queryClient.invalidateQueries({ queryKey: ['followSuggestions'] });
        queryClient.invalidateQueries({ queryKey: ['userData'] });
        
        // Refetch profile to update follow state
        refetchProfile();
      } else {
        toast.error(data?.message || 'Failed to update follow status');
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update follow status');
    },
  });
  
  const handleFollowToggle = () => {
    followMutation.mutate();
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };
  
  if (profileLoading || postsLoading) return <LoadingPage />;
  
  if (profileError) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
        <p className="text-red-500 mb-4">User not found</p>
        <button 
          onClick={() => navigate('/home/explore')}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Go back to explore →
        </button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{user?.name || 'Profile'} - Social Feed</title>
      </Helmet>

      <div className="space-y-6 w-full max-w-5xl py-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 bg-gray-100" />
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 mb-4">
              <div className="flex items-end gap-4">
                <Avatar 
                  src={user?.photo || ""} 
                  className="w-24 h-24 ring-4 ring-white bg-white"
                  fallback={<FaUser className="text-4xl text-gray-400" />}
                />
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-gray-800">{user?.name || "User"}</h1>
                  <p className="text-gray-500">@{user?.username || "username"}</p>
                </div>
              </div>
              
              {/* Follow Button - Only show if not own profile */}
              {!isOwnProfile && (
                <Button
                  color={isFollowing ? "default" : "primary"}
                  variant={isFollowing ? "bordered" : "solid"}
                  onClick={handleFollowToggle}
                  isLoading={followMutation.isLoading}
                  className="mt-4 md:mt-0"
                  startContent={isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
            
            {/* Bio */}
            {user?.bio && (
              <p className="text-gray-700 mt-2">{user.bio}</p>
            )}
            
            {/* Stats */}
            <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{postsCount}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{followersCount}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{followingCount}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              {user?.location && (
                <div className="flex items-center gap-1">
                  <FaMapMarker className="text-xs" />
                  <span>{user.location}</span>
                </div>
              )}
              {user?.website && (
                <div className="flex items-center gap-1">
                  <FaLink className="text-xs" />
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {user.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <FaCalendar className="text-xs" />
                <span>Joined {formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Posts Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Posts</h2>
          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard 
                  key={post._id || post.id} 
                  post={post} 
                  allComment={false} 
                  callback={() => {
                    refetchPosts();
                    refetchProfile();
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserProfile;