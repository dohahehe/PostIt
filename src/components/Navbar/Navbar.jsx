import {
  Navbar as HeroNav,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
} from "@heroui/react";
import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaBars, FaTimes, FaCompass, FaRss, FaUser, FaCog, FaBookmark, FaHome } from "react-icons/fa";
import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown";

export default function Navbar() {
  let { userToken, setUserToken, userData, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if on auth pages
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (userToken) setUserToken(null);
    if (userData) setUserData(null);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 0);
  };

  const navItems = [
    { path: '/home/explore', icon: FaCompass, label: 'Explore' },
    { path: '/home/feed', icon: FaRss, label: 'Feed' },
    { path: '/home/bookmarks', icon: FaBookmark, label: 'Bookmarks' },
    { path: '/home/profile', icon: FaUser, label: 'Profile' },
    { path: '/home/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <>
      <HeroNav 
        className={`bg-white/80 backdrop-blur-md border-b transition-all duration-300 sticky top-0 z-50 ${
          isScrolled ? 'shadow-md bg-white/95' : 'shadow-sm bg-white/80'
        } ${isAuthPage ? 'border-gray-100' : 'border-gray-100'}`}
        style={{ maxWidth: '100%' }}
        classNames={{
          wrapper: "max-w-7xl w-full mx-auto px-4",
        }}
      >
        <div className="max-w-7xl w-full mx-auto px-4 py-2 flex items-center justify-between">
          <NavbarBrand>
            <div 
              onClick={() => navigate(userToken ? '/home' : '/')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <p className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                PostIt
              </p>
            </div>
          </NavbarBrand>
          
          <div className="flex justify-end gap-4 md:gap-8 items-center">
            {/* Desktop Navigation Links */}
            {userToken != null && !isAuthPage && (
              <div className="hidden md:flex gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            )}
            
            {/* User Menu */}
            {userToken != null ? (
              <div className="flex items-center gap-2 md:gap-4">
                {/* Notification Bell - Only show when logged in */}
                {!isAuthPage && <NotificationsDropdown />}
                
                <Dropdown placement="bottom-end">
                  <DropdownTrigger className="cursor-pointer">
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform hover:scale-105"
                      color="primary"
                      name={userData?.name || 'User'}
                      size="md"
                      src={userData?.photo || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2" textValue="Signed in as User">
                      <Link to='/home/profile'>
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-semibold text-sm">{userData?.email || 'User@gmail.com'}</p>
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                
                {/* Mobile Menu Button */}
                <Button
                  isIconOnly
                  variant="light"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <NavLink
                  to='/'
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to='/register'
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`
                  }
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </HeroNav>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && userToken != null && !isAuthPage && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white shadow-xl z-40 md:hidden animate-slideDown rounded-b-2xl">
            <div className="p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}