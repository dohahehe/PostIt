import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaBell, FaSpinner, FaUserPlus, FaHeart, FaComment, FaShare, FaBookmark } from 'react-icons/fa';
import { getNotifications, getUnreadCount, markNotificationAsRead, markAllAsRead } from '../../service/NotificationApi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from "@heroui/react";

function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  
  // Fetch unread count
  const { data: unreadData, refetch: refetchUnreadCount } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => getUnreadCount(),
    refetchInterval: 30000,
  });
  
  // Fetch notifications
  const { data: notificationsData, isLoading, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(false, 1, 20),
    enabled: isOpen,
  });
  
  const unreadCount = unreadData?.data?.unreadCount || unreadData?.unreadCount || 0;
  const notifications = notificationsData?.data?.notifications || notificationsData?.notifications || [];
  
  // Mark as read mutation
  const markReadMutation = useMutation({
    mutationFn: (notificationId) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
  
  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to mark all as read');
    },
  });
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification._id);
    }
    setIsOpen(false);
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
      case 'follow_user':
        return <FaUserPlus className="text-blue-500" />;
      case 'like':
      case 'like_post':
        return <FaHeart className="text-red-500" />;
      case 'comment':
      case 'comment_post':
        return <FaComment className="text-green-500" />;
      case 'share':
      case 'share_post':
        return <FaShare className="text-purple-500" />;
      case 'bookmark':
        return <FaBookmark className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  const getNotificationMessage = (notification) => {
    const actorName = notification.actor?.name || 'Someone';
    const action = notification.type?.replace('_', ' ') || 'interacted with';
    
    switch (notification.type) {
      case 'follow':
      case 'follow_user':
        return `${actorName} started following you`;
      case 'like':
      case 'like_post':
        return `${actorName} liked your post`;
      case 'comment':
      case 'comment_post':
        return `${actorName} commented on your post`;
      case 'share':
      case 'share_post':
        return `${actorName} shared your post`;
      default:
        return notification.content || `${actorName} ${action} your content`;
    }
  };
  
  const getNotificationLink = (notification) => {
    if (notification.entityType === 'post' && notification.entityId) {
      return `/home/singlepost/${notification.entityId}`;
    }
    if (notification.entityType === 'user' && notification.actor?._id) {
      return `/home/profile/${notification.actor._id}`;
    }
    return '#';
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <FaBell className="text-xl text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isLoading}
                className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-gray-400" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <Link
                    key={notification._id}
                    to={getNotificationLink(notification)}
                    onClick={() => handleNotificationClick(notification)}
                    className={`block p-4 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Actor Avatar */}
                      <Avatar
                        src={notification.actor?.photo || ""}
                        size="sm"
                        className="flex-shrink-0"
                        fallback={<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm text-gray-800">
                              <span className="font-semibold">{notification.actor?.name || 'Someone'}</span>
                              {' '}
                              <span className="text-gray-600">
                                {getNotificationMessage(notification)}
                              </span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        
                        {/* Preview of the entity if it's a post */}
                        {notification.entity && notification.entityType === 'post' && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg text-xs text-gray-500 truncate">
                            {notification.entity.body?.substring(0, 60)}
                            {notification.entity.body?.length > 60 && '...'}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaBell className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">When someone interacts with your posts, you'll see it here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsDropdown;