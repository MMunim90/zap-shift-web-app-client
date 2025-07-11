import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';
import Loading from '../pages/shared/Loading/Loading';

const RiderRoute = ({children}) => {

    const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return <Loading />;
  }

  if (!user || role !== "rider") {
    return <Navigate to="/forbidden" state={{ from: location.pathname }} />;
  }
    return children;
};

export default RiderRoute;