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
import { useContext, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaBars, FaTimes, FaCompass, FaRss, FaUser, FaCog, FaBookmark } from "react-icons/fa";
import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown";

export default function Navbar() {
  let { userToken, setUserToken, userData, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <HeroNav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50"
      style={{ maxWidth: '100%' }}
      classNames={{
        wrapper: "max-w-7xl w-full mx-auto px-4",
      }}>
        <div className="max-w-7xl w-full mx-auto px-4 py-2 flex items-center justify-between">
          <NavbarBrand>
            <p
              onClick={() => navigate('/home')}
              className="font-bold text-xl text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
            >
              PostIt
            </p>
          </NavbarBrand>
          
          <div className="flex justify-end gap-8 items-center">
            {/* Desktop Navigation Links */}
            {userToken != null && (
              <div className="hidden md:flex gap-6">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
            
            {/* User Menu */}
            {userToken != null ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <NotificationsDropdown />
                
                <Dropdown placement="bottom-end">
                  <DropdownTrigger className="cursor-pointer">
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform"
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
              <NavbarContent className="flex gap-4" justify="center">
                <NavbarItem>
                  <NavLink to='/register' className="text-gray-600 hover:text-blue-600 transition-colors">
                    Register
                  </NavLink>
                </NavbarItem>
                <NavbarItem>
                  <NavLink to='/' className="text-gray-600 hover:text-blue-600 transition-colors">
                    Login
                  </NavLink>
                </NavbarItem>
              </NavbarContent>
            )}
          </div>
        </div>
      </HeroNav>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && userToken != null && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 md:hidden animate-slideDown">
            <div className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="text-lg text-gray-500" />
                    <span className="text-gray-700 font-medium">{item.label}</span>
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