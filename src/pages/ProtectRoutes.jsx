import React from 'react'
import { Navigate } from 'react-router-dom';

function ProtectRoutes({children}) {
    if (localStorage.getItem('token') != null) {
      // there is a token so user can access any page
      return children;
    }else{
      // no token
      return <Navigate to='/'/>
    }
}

export default ProtectRoutes