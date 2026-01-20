import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { getSinglePost } from '../../service/PostApi';
import PostCard from '../../components/PostCard/PostCard';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import { Helmet } from 'react-helmet';

// ? useParams: returns all parameters in url

function SinglePost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    try {
      const response = await getSinglePost(id);
      
      if (response.message === 'success') {
        setPost(response.post);
        console.log(response.post);
      } 
    } catch (error) {
      console.error("Error fetching post:", error);
    } 
  }

  return (
    <>
      <Helmet>
          <meta charSet="utf-8" />
          <title>Post</title>
      </Helmet>
    <div className='min-h-screen container flex flex-col items-center'>
      {post ?  
      <PostCard post={post} allComment={true} callback={fetchPost} /> 
      : 
      <LoadingPage /> 
      }
     
    </div>
    </>
  )
}

export default SinglePost