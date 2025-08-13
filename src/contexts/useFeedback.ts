import { createContext, useContext } from 'react';
import type { FeedbackContextProps } from '../data/Types';

export const FeedbackContext = createContext<FeedbackContextProps | undefined>(
	undefined
);

export const useFeedback = () => {
	const context = useContext(FeedbackContext);
	if (!context) {
		throw new Error('useFeedback must be used within a FeedbackProvider');
	}
	return context;
};
