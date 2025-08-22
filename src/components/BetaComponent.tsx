/** ======= CONTEXT ======= */
import { useAuth } from '../contexts/useAuth';

/** ======= TYPES ======= */
import type { ParentComp } from '../data/Types';


/**   A component that selectively shows content for beta testers */
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