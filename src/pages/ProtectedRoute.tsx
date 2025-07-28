/** ======= REACT-ROUTER ======= */
import { Navigate, Outlet } from 'react-router-dom';

/** ======= CONTEXTS ======= */
import { useAuth } from '../contexts/AuthContext';

/** ======= LOADING PAGE ======= */
import LoadingPage from './LoadingPage';

const ProtectedRoute = () => {
    /** ======= GET THE CURRENT AUTH STATE ======= */
    const { user, userData, loading } = useAuth();
    /** ======= DISPLAY THE LOADING UI WHILE AUTH STATE IS BEING RETRIEVED ======= */
    if (loading) return <LoadingPage />;
    /** ======= IF THERE IS NO USER OR USER DATA, THERE IS NO USER LOGGED IN ======= */
    if (!user || !userData) return <Navigate to="/login" replace />;
    /** ======= RETURN THE PROTECTED ROUTE IF IT PASSED ALL THE CHECKS ======= */
    return <Outlet />;
};

export default ProtectedRoute;