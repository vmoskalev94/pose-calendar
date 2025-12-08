// src/features/auth/ProtectedRoute.tsx
import type {ReactNode} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {Center, Loader} from '@mantine/core';
import {useAuth} from './AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const {isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader/>
            </Center>
        );
    }

    if (!isAuthenticated) {
        // запомним, откуда пришли (на будущее)
        return <Navigate to="/login" replace state={{from: location}}/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
