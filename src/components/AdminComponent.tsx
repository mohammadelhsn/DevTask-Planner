import { useAuth } from '../contexts/AuthContext';
import type { ParentComp } from '../data/Types';

const AdminComponent = ({ children }: ParentComp) => {
    const { userData } = useAuth();

    if (!userData?.isAdmin()) return null;
    return (
        <>{children}</>
    );
};

export default AdminComponent;