import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button } from "@heroui/react";
import { FaUserPlus, FaUserCheck, FaSpinner } from 'react-icons/fa';
import { getFollowSuggestions, followUser } from '../../service/FollowApi';
import toast from 'react-hot-toast';

function RightSidebar() {
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['followSuggestions'],
    queryFn: () => getFollowSuggestions(5),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const followMutation = useMutation({
    mutationFn: (userId) => followUser(userId),
    onSuccess: (data) => {
      if (data?.message === 'success') {
        toast.success('Followed successfully!');
        queryClient.invalidateQueries({ queryKey: ['followSuggestions'] });
        queryClient.invalidateQueries({ queryKey: ['userData'] });
      } else {
        toast.error(data?.message || 'Failed to follow');
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to follow');
    },
  });
  
  const suggestions = data?.data?.suggestions || data?.users || [];  
  
  const handleFollow = (userId) => {
    followMutation.mutate(userId);
  };
  
  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Who to follow</h3>
        <p className="text-sm text-gray-500">Failed to load suggestions</p>
        <button onClick={() => refetch()} className="text-blue-500 text-sm mt-2">
          Try again
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
      <h3 className="font-semibold text-gray-800 mb-4">Who to follow</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <FaSpinner className="animate-spin text-gray-400" />
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((user) => (
            <div key={user._id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar 
                  src={user?.photo || ""} 
                  size="sm"
                  fallback={<FaUserPlus className="text-gray-400" />}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-400 truncate">@{user?.username || "username"}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="light"
                color="primary"
                onClick={() => handleFollow(user._id)}
                isLoading={followMutation.isLoading && followMutation.variables === user._id}
                className="min-w-[70px]"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No suggestions right now</p>
        </div>
      )}
    </div>
  );
}

export default RightSidebar;