import React from 'react';
import {Navigate} from 'react-router-dom';
import useAuth from "./UseAuth";

export default function ProtectedRoute({children}) {
    const {isAuthenticated, loading} = useAuth();

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login"/>;
    }

    return children;
};