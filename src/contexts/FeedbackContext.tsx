/** ======= REACT ======= */
import { useState, type FC, type ReactNode } from 'react';
import type { FeedbackType } from '../data/Types';
import { FeedbackContext } from './useFeedback';

export const FeedbackProvider: FC<{ children: ReactNode; }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<FeedbackType>('info');

    const setFeedback = (msg: string, msgType: FeedbackType = 'info') => {
        setMessage(msg);
        setType(msgType);
    };

    const clearFeedback = () => {
        setMessage(null);
    };
    return (
        <FeedbackContext.Provider value={{ message, type, setFeedback, clearFeedback }}>
            {children}
        </FeedbackContext.Provider>
    );
};
