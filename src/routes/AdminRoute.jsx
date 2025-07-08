import React from 'react';
import useAuth from '../hooks/useAuth';
import Loading from '../pages/shared/Loading/Loading';
import useUserRole from '../hooks/useUserRole';
import { Navigate } from 'react-router';

const AdminRoute = ({children}) => {
    const {user, loading} = useAuth();
    const {role} = useUserRole();

    if(loading){
        return <Loading></Loading>
    }

    if(!user || role !== 'admin'){
        return <Navigate state={{from: location.pathname}} to='/forbidden'></Navigate>
    }
    return children;
};

export default AdminRoute;