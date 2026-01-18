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
} from "@heroui/react";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


export default function Navbar() {
  let {userToken, setUserToken, userData, setUserData} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear tokens from localStorage
    localStorage.removeItem('token');

    
    // 2. Clear auth context states
    if (userToken) {
      setUserToken(null);
    }
    if (userData) {
      setUserData(null);
    }
    
    // 3. Redirect to login page
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 0);
  };
  return (
    <HeroNav>
      <NavbarBrand>
        <p
        onClick={() =>{ navigate('/home')}}
        className="font-bold text-inherit cursor-pointer">PostIt</p>
      </NavbarBrand>
      <div className="flex justify-end gap-8">
        {userToken != null ? 
        <NavbarContent as="div" justify="end" >
          <Dropdown placement="bottom-end">
            <DropdownTrigger className="cursor-pointer">
              <Avatar
                isBordered
                as="button"
                className="transition-transform cursor-pointers"
                color="primary"
                name={userData && userData.name ? userData.name : 'User'}
                size="md"
                src={userData && userData.photo ? userData.photo : "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" textValue="Signed in as User">
                <NavLink to='/profile'>
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{userData && userData.email ? userData.email : 'User@gmail.com'}</p>
                </NavLink>
                
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent> 
        : 
        <NavbarContent className="flex gap-4" justify="center">
          <NavbarItem>
            <NavLink to='/register' color="foreground">
              Register
            </NavLink>
          </NavbarItem>
          <NavbarItem isActive>
            <NavLink to='/' aria-current="page" color="secondary">
              Login
            </NavLink>
          </NavbarItem> 
        </NavbarContent>
        }
      </div>
    </HeroNav>
  );
}
