import { useState, useEffect } from 'react'
import PostCard from './../../components/PostCard/PostCard';
import { getAllPosts } from '../../service/PostApi';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import CreatePost from '../../components/CreatePost/CreatePost';
import { GetUserData } from '../../service/loginApi';


function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [Loading, setLoading] = useState([]);


  async function getposts(){
    const response = await getAllPosts();
    // console.log(response);
    if (response.message == 'success') {
      setAllPosts(response.posts)
    }
    const userRes = await GetUserData()
    // console.log(userRes);
    
  }

  useEffect(() => {
    getposts();
    
  }, []);

  return (
    <div className='min-h-screen container flex flex-col items-center'>
      <CreatePost callback={getposts} />
      {/* allPosts > 0 ? 'posts gat' : 'loading' */}
      {allPosts.length > 0 ? 
        allPosts.map((post) => (
          <PostCard key={post._id || post.id} post={post} allComment={false} callback={getposts} />
        ))
        : 
        <LoadingPage />
      }
       
      
    </div>
  )
}

export default Home