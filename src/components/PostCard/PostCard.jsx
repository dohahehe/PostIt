import { Link } from 'react-router-dom'; 
import { useContext, useState } from 'react';
import { Button, Avatar, Card, Divider, Spinner } from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaTrash, FaUserCircle, FaImage, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import CommentCard from '../CommentCard/CommentCard';
import { CreateComment, GetPostComments } from '../../service/CommentApi';
import { LikePost, BookmarkPost, SharePost } from '../../service/PostApi';
import PostDropDown from '../PostDropDown/PostDropDown';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function PostCard({ post, allComment = false, callback }) {
  const { userData } = useContext(AuthContext); 
  
  const [commentContent, setCommentContent] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareBody, setShareBody] = useState('');
  
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(userData?._id) || false);
  const [isBookmarked, setIsBookmarked] = useState(post?.bookmarked || false);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  
  const queryClient = useQueryClient();
  
  const limit = 3;
  
  // Fetch comments
  const { 
    data: commentsData, 
    isLoading: commentsLoading,
    isFetching: isFetchingMore,
    refetch: refetchComments
  } = useQuery({
    queryKey: ['comments', post?._id, currentPage],
    queryFn: () => GetPostComments(post?._id, currentPage, limit),
    enabled: !!post?._id && (allComment || showComments),
    staleTime: 1000 * 30,
    keepPreviousData: true,
  });
  
  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: ({ content, imageFile }) => CreateComment(content, post?._id, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', post?._id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast.success('Comment added!');
      setCommentContent('');
      setCommentImage(null);
      setCommentImagePreview(null);
      
      if (callback) callback();
      
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        refetchComments();
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to add comment');
    },
  });
  
  // Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: () => LikePost(post?._id),
    onSuccess: (data) => {
      if (data?.message === 'success') {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        toast.success(isLiked ? 'Unliked post' : 'Liked post');
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        if (callback) callback();
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to like/unlike post');
    },
  });
  
  // Bookmark/Unbookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: () => BookmarkPost(post?._id),
    onSuccess: (data) => {
      if (data?.message === 'success') {
        setIsBookmarked(!isBookmarked);
        toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        if (callback) callback();
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to bookmark/unbookmark post');
    },
  });
  
  // Share mutation
  const shareMutation = useMutation({
    mutationFn: () => SharePost(post?._id, shareBody),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Post shared successfully!');
        setShowShareModal(false);
        setShareBody('');
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        if (callback) callback();
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to share post');
    },
  });
  
  const comments = commentsData?.data?.comments || commentsData?.comments || [];
  const totalComments = commentsData?.data?.total || commentsData?.total || post?.commentsCount || 0;
  const hasMoreComments = comments.length < totalComments;
  const displayComments = (allComment || showComments) ? comments : (comments.length > 0 ? [comments[0]] : []);
  
  const handleCreateComment = (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    createCommentMutation.mutate({ content: commentContent, imageFile: commentImage });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setCommentImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCommentImagePreview(previewUrl);
    } else if (file) {
      toast.error('Image must be less than 5MB');
    }
  };
  
  const removeImage = () => {
    if (commentImagePreview) {
      URL.revokeObjectURL(commentImagePreview);
    }
    setCommentImage(null);
    setCommentImagePreview(null);
  };
  
  const loadMoreComments = () => {
    setCurrentPage(prev => prev + 1);
  };
  
  const handleLike = () => {
    likeMutation.mutate();
  };
  
  const handleBookmark = () => {
    bookmarkMutation.mutate();
  };
  
  const handleShare = () => {
    if (!shareBody.trim()) {
      toast.error('Please add a caption for your share');
      return;
    }
    shareMutation.mutate();
  };
  
  // Get shared post data if exists
  const sharedPost = post?.sharedPost;
  const isShared = !!sharedPost;
  
  return (
    <>
      <Card className="w-full mb-4 shadow-sm">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <Link to={`/home/profile/${post?.user?._id}`} className="flex items-center gap-3 flex-1">
            <Avatar 
              src={post?.user?.photo || ""} 
              size="md"
              fallback={<FaUserCircle className="text-2xl text-gray-400" />}
            />
            <div>
              <p className="font-semibold text-sm">{post?.user?.name || "Anonymous"}</p>
              <p className="text-xs text-gray-500">{formatDate(post?.createdAt)}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={handleBookmark} className="focus:outline-none cursor-pointer">
              {isBookmarked ? (
                <FaBookmark className="text-yellow-500 text-lg" />
              ) : (
                <FaRegBookmark className="text-gray-500 text-lg hover:text-yellow-500" />
              )}
            </button>
            {userData?._id === post?.user?._id && (
              <PostDropDown callback={callback} postId={post?._id} />
            )}
          </div>
        </div>
        
        {/* Content */}
        <Link to={`/home/singlepost/${post?._id}`}>
            <div className="px-4 pb-3">
            <p className="text-gray-800 text-sm whitespace-pre-wrap">{post?.body || "No content"}</p>
            
            {/* Shared Post */}
            {isShared && sharedPost && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar 
                    src={sharedPost?.user?.photo || ""} 
                    size="sm"
                    fallback={<FaUserCircle className="text-gray-400" />}
                  />
                  <span className="text-xs font-medium">{sharedPost?.user?.name}</span>
                </div>
                <p className="text-sm text-gray-700">{sharedPost?.body}</p>
                {sharedPost?.image && (
                  <img 
                    src={sharedPost.image} 
                    alt="Shared post" 
                    className="mt-2 rounded-lg max-h-48 w-full object-cover"
                  />
                )}
              </div>
            )}
            
            {/* Post Image */}
            {post?.image && !isShared && (
              <img 
                src={post.image} 
                alt="Post" 
                className="mt-3 rounded-lg max-h-96 w-full object-cover"
              />
            )}
          </div>
        </Link>
        
        
        <Divider />
        
        {/* Stats */}
        <div className="px-4 py-2 flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FaHeart className="text-red-500 text-sm" />
            <span>{likesCount}</span>
          </div>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="hover:text-blue-500 transition"
          >
            {totalComments} {totalComments === 1 ? 'comment' : 'comments'}
          </button>
        </div>
        
        <Divider />
        
        {/* Actions */}
        <div className="px-4 py-2 flex justify-around">
          <Button 
            variant="light" 
            size="sm" 
            className="flex-1 gap-2"
            onClick={handleLike}
            isLoading={likeMutation.isLoading}
          >
            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />} 
            Like
          </Button>
          <Button 
            variant="light" 
            size="sm" 
            className="flex-1 gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <FaComment /> Comment
          </Button>
          <Button 
            variant="light" 
            size="sm" 
            className="flex-1 gap-2"
            onClick={() => setShowShareModal(true)}
          >
            <FaShare /> Share
          </Button>
        </div>
        
        <Divider />
        
        {/* Add Comment */}
        <div className="px-4 py-3">
          <form onSubmit={handleCreateComment} className="flex gap-2">
            <Avatar 
              src={userData?.photo} 
              size="sm"
              fallback={<FaUserCircle className="text-gray-400" />}
            />
            <div className="flex-1">
              <input
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={createCommentMutation.isLoading}
              />
              
              {/* Image Preview */}
              {commentImagePreview && (
                <div className="mt-2 relative">
                  <img 
                    src={commentImagePreview} 
                    alt="Comment preview" 
                    className="rounded-lg max-h-32 w-auto object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={createCommentMutation.isLoading}
                />
                <div className={`p-2 hover:bg-gray-100 rounded-lg transition ${commentImagePreview ? 'text-blue-500' : 'text-gray-500'}`}>
                  <FaImage className="w-5 h-5" />
                </div>
              </label>
              <Button
                type="submit"
                color="primary"
                size="sm"
                isLoading={createCommentMutation.isLoading}
              >
                Post
              </Button>
            </div>
          </form>
        </div>
        
        {/* Comments Section */}
        {(allComment || showComments) && (
          <div className="px-4 pb-4">
            {commentsLoading && currentPage === 1 ? (
              <div className="flex justify-center py-4">
                <Spinner size="sm" />
              </div>
            ) : displayComments.length > 0 ? (
              <div className="space-y-3">
                {displayComments.map((comment) => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    postId={post?._id} 
                    callback={callback}
                  />
                ))}
                
                {hasMoreComments && (
                  <Button
                    variant="light"
                    size="sm"
                    onClick={loadMoreComments}
                    isLoading={isFetchingMore}
                    className="w-full text-sm"
                  >
                    {isFetchingMore ? 'Loading...' : `Load more (${comments.length} of ${totalComments})`}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <FaComment className="text-2xl text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No comments yet</p>
              </div>
            )}
          </div>
        )}
      </Card>
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Share this post</h3>
            <textarea
              value={shareBody}
              onChange={(e) => setShareBody(e.target.value)}
              placeholder="Write something about this post..."
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="light"
                onPress={() => {
                  setShowShareModal(false);
                  setShareBody('');
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleShare}
                isLoading={shareMutation.isLoading}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PostCard;