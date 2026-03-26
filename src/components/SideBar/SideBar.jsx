import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Avatar } from "@heroui/react";
import { FaRss, FaUser, FaCog, FaCompass, FaSignOutAlt, FaBookmark } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(AuthContext);
  
  const navItems = [
    { path: '/home/explore', icon: FaCompass, label: 'Explore' },
    { path: '/home/feed', icon: FaRss, label: 'Feed' },
    { path: '/home/bookmarks', icon: FaBookmark, label: 'Bookmarks' },
    { path: '/home/profile', icon: FaUser, label: 'Profile' },
    { path: '/home/settings', icon: FaCog, label: 'Settings' },
  ];
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(null);
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <aside className="sticky top-24">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        {/* User Info with Notification Bell */}
        <div className="flex items-center justify-between pb-5 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar 
              src={userData?.photo || ""} 
              size="md"
              className="ring-2 ring-gray-100"
              fallback={<FaUser className="text-gray-400" />}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{userData?.name || "User"}</p>
              <p className="text-xs text-gray-400 truncate">@{userData?.username || "username"}</p>
            </div>
          </div>
          <NotificationsDropdown />
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`text-lg ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <FaSignOutAlt className="text-lg text-gray-400" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;