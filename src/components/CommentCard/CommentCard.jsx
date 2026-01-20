import { useContext } from 'react';
import UserImg from '../../assets/user.png'
import CommentDropDown from '../PostDropDown/CommentDropDown';
import { AuthContext } from '../../context/AuthContext';

function CommentCard({comment, id, callback}) {
  const {userData} = useContext(AuthContext)
  
  

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
    <div className='border-y-1 border-y-gray-300  py-3 px-4 rounded-xl'>
        <div className="w-full flex items-center justify-between">
        <div className="flex">
            <img className=" rounded-full w-10 h-10 mr-3" 
            src={ comment?.commentCreator?.photo || UserImg} 
            alt={ comment?.commentCreator?.name || "User"} 
            onError={(e) => {
                e.target.src =UserImg;
            }}/>
            <div>    
            <h3 className="text-md font-semibold ">{comment?.commentCreator?.name || "Anonymous User"}</h3>
            <p className="text-xs text-gray-500"> {formatDate(comment.createdAt)}</p>

            </div>
        </div>
        {comment?.commentCreator?._id == userData?._id && userData?._id == id &&
          <CommentDropDown comment={comment} callback={callback} />
        }
        </div>
        <p className='pt-3'>{comment?.content || "No content available"}</p>
    </div>
  )
}

export default CommentCard