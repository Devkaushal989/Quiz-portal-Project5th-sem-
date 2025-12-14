import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
/**
 * @param {string} allowedUserType - 'Student' or 'Teacher'
 */
const ProtectedRoute = ({ allowedUserType }) => {
 
  const token = localStorage.getItem('token');
  
  
  let user = null;
  let userType = null;
  try {
    const userString = localStorage.getItem('user');
    if (userString) {
      user = JSON.parse(userString);
      userType = user.userType;
    }
  } catch (e) {
    console.error("Failed to parse user data:", e);
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (userType && userType !== allowedUserType) {
    const redirectPath = userType === 'Student' ? '/student' : '/teacher';
    return <Navigate to={redirectPath} replace />;
  }
 
  return <Outlet />;
};

export default ProtectedRoute;