/** ======= CONTEXT ======= */
import { useAuth } from '../contexts/AuthContext';

/** ======= TYPES ======= */
import type { ParentComp } from '../data/Types';


/** @description A component that selectively shows content for beta testers */
const BetaComponent = ({ children }: ParentComp) => {
    /** ======= GET THE USERDATA ======= */
    const { userData } = useAuth();
    /** ======= RETURN NOTHING IF THE USER IS NOT A BETA TESTER ======= */
    if (!userData || !userData.isBetaTester) return;
    /** ======= RETURN THE CHILD ======= */
    return (
        <>{children}</>
    );
};

export default BetaComponent;