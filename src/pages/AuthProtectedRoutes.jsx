import { Navigate } from 'react-router-dom';

function AuthProtectedRoutes({children}) {
 if (localStorage.getItem('token') != null) {
      // there is a token so user can access any page
      return <Navigate to='/home'/>
    }else{
        return children;
      // no token
    }
}

export default AuthProtectedRoutes