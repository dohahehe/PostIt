import { Link } from 'react-router-dom'; 
import { useContext, useState } from 'react';
import {Button} from "@heroui/react";
import CommentCard from '../CommentCard/CommentCard';
import { CreateComment } from '../../service/CommentApi';
import PostDropDown from '../PostDropDown/PostDropDown';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function PostCard({post, allComment, callback}) {
  const [commentContent, setCommentContent] = useState('');
  const [Loading, setLoading] = useState(false);
  const {userData} = useContext(AuthContext);


  async function createComment(e){
    setLoading(true)
    e.preventDefault();
    const response = await CreateComment(commentContent, post.id);
    console.log(response);
    if (response.message == 'success') {
      await callback();
      toast.success('Commented!')

      setCommentContent('');
    }
    setLoading(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };
  return (
    <>
   <div className='container px-6 lg:px-56 flex justify-center h-fit'>
      <div className="bg-white w-full rounded-2xl shadow-md h-auto py-3 px-3 my-3">
            <div className="w-full h-16 flex items-center justify-between ">
            <div className="flex">
                <img className=" rounded-full w-10 h-10 mr-3" 
                src={post.user?.photo || ""} 
                alt={post.user?.name || "User"} />
                <div>    
                <h3 className="text-md font-semibold ">{post.user?.name || "Anonymous User"}</h3>
                <p className="text-xs text-gray-500"> {formatDate(post.createdAt)}</p>
                </div>
            </div>
            {userData?._id === post.user?._id &&
              <PostDropDown callback={callback} postId={post._id} />
            }
            </div>
            <p>{post.body || "No content available"}</p>
            {post.image && (
                <div className="mt-3">
                <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full h-auto rounded-md max-h-96 object-cover"
                />
                </div>
            )}
        
       
        <div className="w-full h-8 flex items-center px-3 my-3">
          <div className="bg-blue-500 z-10 w-5 h-5 rounded-full flex items-center justify-center ">
            <svg className="w-3 h-3 fill-current text-white" xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
          </div>
          <div className="bg-red-500 w-5 h-5 rounded-full flex items-center justify-center -ml-1">
            <svg className="w-3 h-3 fill-current stroke-current text-white" xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </div>

          <div className="w-full flex justify-between">
            <p className="ml-3 text-gray-500">8</p>
            <Link to={`/singlepost/${post._id}`}>
             <p className="ml-3 text-gray-500">{post.comments.length} comments</p>
            </Link>
          </div>
        </div>

        <hr className='text-gray-300'/>
        <div className="grid grid-cols-3 w-full px-5 my-3">
          <button className="flex flex-row justify-center items-center w-full space-x-3"><svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#838383" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
            <span className="font-semibold text-lg text-gray-600">Like</span></button>
          <button className="flex flex-row justify-center items-center w-full space-x-3"><svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#838383" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <span className="font-semibold text-lg text-gray-600">Comment</span></button>
          <button className="flex flex-row justify-center items-center w-full space-x-3"><svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#838383" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round"><circle cx={18} cy={5} r={3} /><circle cx={6} cy={12} r={3} /><circle cx={18} cy={19} r={3} /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
            <span className="font-semibold text-lg text-gray-600">Share</span></button>
        </div>
        <hr className='text-gray-300'/>

        {/* Add comment section */}

        <div className="flex w-full items-center justify-around pt-3">
          <form onSubmit={createComment} className='flex w-full items-center justify-around gap-4'>
            <input onChange={(e) => {setCommentContent(e.target.value)}} value={commentContent} type="text" className='p-2 w-full border-1 border-gray-300 outline-0 focus:outline-2 focus:outline-gray-400 rounded-lg' placeholder='add a comment..' />
            <Button color="primary" variant="shadow" type='submit' isLoading={Loading} >
              Comment
            </Button>
          </form>
        </div>

        {/* Comments section */}
       
        {post.comments.length > 0 && allComment == false ?
          <div className='pt-3'>
            <CommentCard id={post.user._id} callback={callback} comment={post.comments[0]} />
          </div>
        :
          <div className="flex flex-col gap-3 pt-3">
            {post.comments.map((comment) => { return  <CommentCard key={comment._id} id={post.user._id} callback={callback} comment={comment} /> })}
          </div>
        } 
      </div>
    </div>
    </>
  )
}

export default PostCard