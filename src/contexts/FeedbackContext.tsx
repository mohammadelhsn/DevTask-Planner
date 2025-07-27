import { createContext, useContext, useState, type FC, type ReactNode } from 'react';

type FeedbackType = 'success' | 'error' | 'info' | 'warning';

interface FeedbackContextProps {
    message: string | null;
    type: FeedbackType;
    setFeedback: (msg: string, type?: FeedbackType) => void;
    clearFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextProps | undefined>(undefined);

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

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }
    return context;
};