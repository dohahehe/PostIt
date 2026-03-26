// pages/Profile/Profile.jsx
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../../service/PostApi";
import PostCard from "../../components/PostCard/PostCard";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { uploadProfileImage } from "../../service/LoginApi";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { FaUser, FaCalendar, FaMapMarker, FaLink } from 'react-icons/fa';
import RightSidebar from "../../components/RightSidebar/RightSidebar";

function Profile() {
  const { userData } = useContext(AuthContext);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userPosts', userData?._id],
    queryFn: () => getUserPosts(userData?._id),
    enabled: !!userData?._id,
  });
  
  const userPosts = data?.data.posts || [];
  
  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('photo', file);
    
    try {
      const response = await uploadProfileImage(formData);
      if (response.success) {
        toast.success('Profile picture updated!');
        refetch();
      }
    } catch (error) {
      toast.error('Failed to upload image');
    }
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };
  
  if (isLoading) return <LoadingPage />;
  
  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 bg-gray-100" />
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 mb-4">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <img 
                    src={userData?.photo || "https://via.placeholder.com/100"} 
                    alt={userData?.name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white bg-white"
                  />
                  <label className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50">
                    <MdEdit className="text-sm text-gray-600" />
                    <input type="file" className="hidden" onChange={uploadImage} />
                  </label>
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-gray-800">{userData?.name || "User"}</h1>
                  <p className="text-gray-500">@{userData?.username || "username"}</p>
                </div>
              </div>
            </div>
            
            {/* Bio */}
            {userData?.bio && (
              <p className="text-gray-700 mt-2">{userData.bio}</p>
            )}
            
            {/* Stats */}
            <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{userPosts.length}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{userData?.followersCount || 0}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{userData?.followingCount || 0}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              {userData?.location && (
                <div className="flex items-center gap-1">
                  <FaMapMarker className="text-xs" />
                  <span>{userData.location}</span>
                </div>
              )}
              {userData?.website && (
                <div className="flex items-center gap-1">
                  <FaLink className="text-xs" />
                  <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {userData.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <FaCalendar className="text-xs" />
                <span>Joined {formatDate(userData?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Posts Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Posts</h2>
          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard 
                  key={post._id || post.id} 
                  post={post} 
                  allComment={false} 
                  callback={refetch} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500">No posts yet</p>
              <p className="text-sm text-gray-400 mt-1">Share your first post!</p>
            </div>
          )}
        </div>

        {/* follow suggestions for small screens */}
        <div className="sm:hidden">
          <RightSidebar />
        </div>
      </div>
    </>
  );
}

export default Profile;