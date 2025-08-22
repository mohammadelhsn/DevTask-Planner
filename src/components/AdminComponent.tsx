/** ======= CONTEXT ======= */
import { useAuth } from '../contexts/useAuth';

/** ======= TYPES ======= */
import type { ParentComp } from '../data/Types';

/**   A component that shows admin only content for admin users */
const AdminComponent = ({ children }: ParentComp) => {
    /** ======= GET THE USER DATA ======= */
    const { userData } = useAuth();
    /** ======= RETURN NOTHING IF THE USER IS NOT AN ADMIN ======= */
    if (!userData || !userData.isAdmin()) return;
    /** ======= RETURN THE CHILD ======= */
    return (
        <>
            {children}
        </>
    );
};

export default AdminComponent;
