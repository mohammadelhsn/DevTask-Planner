import { createContext, useContext } from 'react';
import type { AuthContextType } from '../data/Types';

export const AuthContext = createContext<AuthContextType>({
	user: null,
	userData: null,
	loading: true,
});

export const useAuth = () => useContext(AuthContext);
