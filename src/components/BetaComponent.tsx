import { useAuth } from '../contexts/AuthContext';
import type { ParentComp } from '../data/Types';


const BetaComponent = ({ children }: ParentComp) => {
    const { userData } = useAuth();
    if (!userData?.isBetaTester) return null;
    return (
        <>{children}</>
    );
};

export default BetaComponent;