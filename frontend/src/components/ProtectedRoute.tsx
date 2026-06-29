import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if the user is "logged in" by looking for the token
  const token = localStorage.getItem('token');

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, allow access to the route
  return <Outlet />;
};

export default ProtectedRoute;