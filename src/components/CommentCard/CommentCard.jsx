import { useState, useContext } from 'react';
import { Avatar, Button } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaTrash, FaEdit, FaUserCircle, FaHeart, FaRegHeart, FaImage, FaReply, FaSpinner, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { DeleteComment, UpdateComment, LikeComment, GetCommentReplies, CreateReply } from '../../service/CommentApi';
import toast from 'react-hot-toast';

function CommentCard({ comment, postId, callback, isReply = false }) {
  const { userData } = useContext(AuthContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content || '');
  const [editedImage, setEditedImage] = useState(null);
  const [editedImagePreview, setEditedImagePreview] = useState(null);
  const [isLiked, setIsLiked] = useState(comment?.likes?.includes(userData?._id) || false);
  const [likesCount, setLikesCount] = useState(comment?.likesCount || 0);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const queryClient = useQueryClient();
  const limit = 5;

  // Fetch replies 
  const { 
    data: repliesData, 
    isLoading: repliesLoading,
    isFetching: isFetchingMore,
    refetch: refetchReplies
  } = useQuery({
    queryKey: ['replies', postId, comment._id, currentPage],
    queryFn: () => GetCommentReplies(postId, comment._id, currentPage, limit),
    enabled: !isReply && showReplies && !!postId && !!comment._id,
    staleTime: 1000 * 30,
    keepPreviousData: true,
  });

  const replies = repliesData?.data?.replies || repliesData?.replies || [];
  const totalReplies = replies.length;
  const hasMoreReplies = replies.length < totalReplies;

  const canInteract = !isReply;

  // Delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: () => DeleteComment(postId, comment._id),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Comment deleted');
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        if (callback) callback();
      } else {
        toast.error(data?.message || 'Failed to delete comment');
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete comment');
    },
    enabled: canInteract,
  });

  // Update comment mutation
  const updateMutation = useMutation({
    mutationFn: () => UpdateComment(editedContent, postId, comment._id, editedImage),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Comment updated');
        setIsEditing(false);
        setEditedImage(null);
        setEditedImagePreview(null);
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        if (callback) callback();
      } else {
        toast.error(data?.message || 'Failed to update comment');
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update comment');
    },
    enabled: canInteract,
  });

  // Like comment mutation
  const likeMutation = useMutation({
    mutationFn: () => LikeComment(postId, comment._id),
    onSuccess: (data) => {
      if (data?.success) {
        setIsLiked(!isLiked);
        if (!isLiked) {
          toast.success('Comment liked');
        } else {
          toast.success('Comment unliked');
        }
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to like/unlike comment');
    },
    enabled: canInteract,
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: () => CreateReply(postId, comment._id, replyContent, replyImage),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Reply added!');
        setReplyContent('');
        setReplyImage(null);
        setReplyImagePreview(null);
        setIsReplying(false);
        queryClient.invalidateQueries({ queryKey: ['replies', postId, comment._id] });
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        if (!showReplies) setShowReplies(true);
        if (currentPage !== 1) {
          setCurrentPage(1);
        } else {
          refetchReplies();
        }
        if (callback) callback();
      } else {
        toast.error(data?.message || 'Failed to add reply');
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to add reply');
    },
    enabled: canInteract,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleDelete = () => {
      deleteMutation.mutate();
  };

  const handleUpdate = () => {
    if (!editedContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    updateMutation.mutate();
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleCreateReply = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }
    createReplyMutation.mutate();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setEditedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setEditedImagePreview(previewUrl);
    } else if (file) {
      toast.error('Image must be less than 5MB');
    }
  };

  const handleReplyImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setReplyImage(file);
      const previewUrl = URL.createObjectURL(file);
      setReplyImagePreview(previewUrl);
    } else if (file) {
      toast.error('Image must be less than 5MB');
    }
  };

  const removeImage = () => {
    if (editedImagePreview) {
      URL.revokeObjectURL(editedImagePreview);
    }
    setEditedImage(null);
    setEditedImagePreview(null);
  };

  const removeReplyImage = () => {
    if (replyImagePreview) {
      URL.revokeObjectURL(replyImagePreview);
    }
    setReplyImage(null);
    setReplyImagePreview(null);
  };

  const loadMoreReplies = () => {
    setCurrentPage(prev => prev + 1);
  };

  const commentCreator = comment?.commentCreator || comment?.user || {};

  return (
    <div className={`flex gap-2 ${isReply ? 'mt-2' : ''}`}>
      <Avatar 
        src={commentCreator?.photo || ""} 
        size="sm"
        fallback={<FaUserCircle className="text-gray-400" />}
      />
      <div className="flex-1">
        {/* Comment/Reply Bubble */}
        <div className={`${isReply ? 'bg-gray-100' : 'bg-gray-50'} rounded-lg p-2`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs">
                {commentCreator?.name || "Anonymous"}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(comment?.createdAt)}
              </span>
            </div>
            
            {/* Action Buttons - Only for comments, not replies */}
            {!isReply && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  disabled={likeMutation.isLoading}
                  className="flex items-center gap-1 text-xs hover:opacity-80 transition cursor-pointer"
                >
                  {isLiked ? (
                    <FaHeart className="text-red-500 text-xs" />
                  ) : (
                    <FaRegHeart className="text-gray-400 text-xs" />
                  )}
                  <span className="text-gray-500 text-xs">{likesCount}</span>
                </button>
                
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition cursor-pointer"
                >
                  <FaReply className="text-xs" />
                  <span>Reply</span>
                </button>
                
                {(totalReplies > 0 || replies.length > 0) && (
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="text-xs text-gray-400 hover:text-blue-500 transition cursor-pointer"
                  >
                    {showReplies ? 'Hide' : `View ${totalReplies} ${totalReplies === 1 ? 'reply' : 'replies'}`}
                  </button>
                )}
                
                {userData?._id === commentCreator?._id && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-gray-400 hover:text-blue-500 transition cursor-pointer"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteMutation.isLoading}
                      className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Content */}
          {isEditing && !isReply ? (
            <div className="mt-1">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="2"
                disabled={updateMutation.isLoading}
              />
              
              {editedImagePreview && (
                <div className="mt-2 relative inline-block">
                  <img 
                    src={editedImagePreview} 
                    alt="Preview" 
                    className="rounded-lg max-h-24 w-auto object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-2 mt-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={updateMutation.isLoading}
                  />
                  <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition">
                    <FaImage /> {comment?.image ? 'Change image' : 'Add image'}
                  </div>
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    onClick={handleUpdate}
                    isLoading={updateMutation.isLoading}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(comment?.content || '');
                      setEditedImage(null);
                      setEditedImagePreview(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700">{comment?.content}</p>
              {comment?.image && (
                <div className="mt-2">
                  <img 
                    src={comment.image} 
                    alt="Comment attachment" 
                    className="rounded-lg max-h-48 w-auto max-w-full object-cover"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Reply Form */}
        {!isReply && isReplying && (
          <div className="mt-2 ml-8">
            <form onSubmit={handleCreateReply} className="flex gap-2">
              <Avatar 
                src={userData?.photo} 
                size="sm"
                fallback={<FaUserCircle className="text-gray-400" />}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${commentCreator?.name}...`}
                    className="flex-1 px-3 py-1.5 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={createReplyMutation.isLoading}
                    autoFocus
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleReplyImageChange}
                      disabled={createReplyMutation.isLoading}
                    />
                    <FaImage className={`w-4 h-4 ${replyImagePreview ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-500 transition`} />
                  </label>
                  <Button
                    type="submit"
                    size="sm"
                    color="primary"
                    isLoading={createReplyMutation.isLoading}
                  >
                    Post
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyContent('');
                      setReplyImage(null);
                      setReplyImagePreview(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>
                {replyImagePreview && (
                  <div className="mt-1 relative inline-block">
                    <img 
                      src={replyImagePreview} 
                      alt="Reply preview" 
                      className="rounded-lg max-h-16 w-auto object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeReplyImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Replies List - Simple display without actions */}
        {!isReply && showReplies && (
          <div className="mt-2 ml-6 border-l-2 border-gray-200 pl-3">
            {repliesLoading && currentPage === 1 ? (
              <div className="flex justify-center py-2">
                <FaSpinner className="animate-spin text-gray-400" />
              </div>
            ) : replies.length > 0 ? (
              <div className="space-y-2">
                {replies.map((reply) => (
                  <CommentCard
                    key={reply._id}
                    comment={reply}
                    postId={postId}
                    callback={callback}
                    isReply={true}
                  />
                ))}
                {hasMoreReplies && (
                  <Button
                    size="sm"
                    variant="light"
                    onClick={loadMoreReplies}
                    isLoading={isFetchingMore}
                    className="w-full text-xs"
                  >
                    {isFetchingMore ? 'Loading...' : `Load more replies (${replies.length} of ${totalReplies})`}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">No replies yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentCard;