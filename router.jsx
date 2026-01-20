import { createBrowserRouter } from "react-router-dom";
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

export const route = createBrowserRouter([
  {path: '', element: <Layout /> , children: [
    {path: '', element:  <AuthProtectedRoutes><Login /></AuthProtectedRoutes>},
    {path: 'register', element: <AuthProtectedRoutes><Register/></AuthProtectedRoutes>},
    {path: 'change-password', element: <ProtectRoutes><ChangePassword /></ProtectRoutes>},
    {path: 'home', element: <ProtectRoutes><Home /></ProtectRoutes>},
    {path: 'profile', element: <ProtectRoutes><Profile /></ProtectRoutes>},
    // ! dynamic routing: sending changing data in path
    {path: "/singlepost/:id", element: <ProtectRoutes><SinglePost /></ProtectRoutes>},
    {path: '*', element: <Notfound />}
  ]},
])