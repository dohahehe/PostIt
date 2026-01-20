import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../../service/PostApi";
import PostCard from "../../components/PostCard/PostCard";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { uploadProfileImage } from "../../service/LoginApi";
import { MdEdit } from "react-icons/md";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

function Profile() {
  const { userData } = useContext(AuthContext);
  
  const userName = userData?.name || "User Name";
  const userPhoto = userData?.photo || "https://via.placeholder.com/150";

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['userPosts'],
    queryFn: async () => {
      if (!userData?._id) return null; 
      return await getUserPosts(userData._id); 
    },
    enabled: !!userData?._id,
  })

  async function uploadImage (e){
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('photo', file); // Note: key must be 'photo' as per API
    
    try {
      const response = await uploadProfileImage(formData);
      if (response.message === 'success') {
        toast.success('Profile Picture Updated!');
        
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } 
    }
  
  return (
    <>
      <Helmet>
          <meta charSet="utf-8" />
          <title>Profile</title>
      </Helmet>

      <main className="profile-page min-h-screen w-full pt-10 md:pt-0 ">
      {/* Profile Content Section */}
      <section className="relative w-full py-8 md:pt-16 md:pb-8">
        <div className="container px-6 lg:px-56 mx-auto">
          <div className="relative bg-white rounded-xl shadow-lg overflow-visible">
            {/* Profile Header */}
            <div className="px-6 py-8 md:px-8">
              <div className="relative flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative -mt-20 mb-6">
                  <input 
                  className="hidden"
                  id="profilePicture" type="file" 
                  onChange={(e) => uploadImage(e)} />
                  <label 
                  className="absolute bottom-0 right-4 p-2 bg-white border border-gray-300 rounded-full cursor-pointer hover:bg-gray-100"
                  htmlFor="profilePicture">
                   <MdEdit className="text-xl"/>
                  </label>
                  
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                    <img 
                      src={userPhoto}
                      alt={userName}
                      className="w-full h-full object-cove z"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center">
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
                    {userName}
                  </h1>
                  
                  {/* Add more user information */}
                  {userData?.email && (
                    <p className="text-gray-600 mb-4">{userData.email}</p>
                  )}                  
                </div>

                {/* Add more profile sections */}
                <div className="w-full lg:absolute lg:left-0 lg:top-0 md:w-1/2 lg:w-1/4 mt-2 lg:mt-0">
                  <div className="bg-blue-50 p-4 rounded-lg text-center ">
                    <h3 className="text-lg font-semibold text-blue-700">Posts</h3>
                    <p className="text-2xl font-bold text-blue-900 mt-2">{data?.posts?.length}</p>
                  </div>
                </div>

                <div className="w-full text-center lg:absolute lg:right-0 lg:top-0 md:w-1/2 lg:w-1/4 mt-2 lg:mt-0">
                  <p className="w-full lg:text-right text-sm text-gray-500 text-center hover:text-gray-700">
                    <NavLink to="/change-password">Change Password?</NavLink>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Posts Section  */}
      <section className="w-full container mx-auto px-4 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 px-4 lg:px-56">My Posts</h2>
        {isLoading ? (
          <LoadingPage />
        ) : isError ? (
          <p>Error loading posts.</p>
        ) : data?.posts?.length > 0 ? (
          <div className="w-full">
            {data.posts.map((post) => {
              return (
                <PostCard key={post._id || post.id} post={post} allComment={false} callback={refetch} />
              )
            })}
          </div>
        ) : (
          <div className="w-1/3 m-auto text-center py-6 bg-white">
            <p>No posts available.</p>
          </div>
          
        )}
      </section>


    </main>
    </>
    
  )
}

export default Profile