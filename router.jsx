import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./src/components/Layout/Layout";
import Login from "./src/auth/Login/Login";
import Register from "./src/auth/Register/Register";
import ChangePassword from "./src/auth/ChangePassword/ChangePassword";
import Home from "./src/pages/Home/Home";
import Profile from "./src/pages/Profile/Profile";
import SinglePost from "./src/pages/SinglePost/SinglePost";
import Notfound from "./src/components/Notfound/Notfound";
import ProtectRoutes from "./src/pages/ProtectRoutes";
import AuthProtectedRoutes from "./src/pages/AuthProtectedRoutes";
import Explore from "./src/pages/Explore/Explore";
import Feed from "./src/pages/Feed/Feed";
import Settings from "./src/pages/Settings/Settings";
import UserProfile from "./src/pages/UserProfile/UserProfile";
import Bookmarks from "./src/pages/Bookmarks/Bookmarks";

export const route = createBrowserRouter([
  {path: '', element: <Layout /> , children: [
    {path: '', element:  <AuthProtectedRoutes><Login /></AuthProtectedRoutes>},
    {path: 'register', element: <AuthProtectedRoutes><Register/></AuthProtectedRoutes>},
    {path: 'change-password', element: <ProtectRoutes><ChangePassword /></ProtectRoutes>},
    {path: 'home', element: <ProtectRoutes><Home /></ProtectRoutes>, children: [
      {path: '', element: <Navigate to="explore" replace />},
      {path: 'explore', element: <Explore />},
      {path: 'feed', element: <Feed />},
      {path: 'profile', element: <Profile />},
      {path: 'settings', element: <Settings />},
      {path: 'profile/:userId', element: <UserProfile />},
      { path: 'bookmarks', element: <Bookmarks /> },
      {path: "singlepost/:id", element: <SinglePost />},
    ]},
    {path: 'profile', element: <ProtectRoutes><Profile /></ProtectRoutes>},
    // ! dynamic routing: sending changing data in path
    {path: '*', element: <Notfound />}
  ]},
])