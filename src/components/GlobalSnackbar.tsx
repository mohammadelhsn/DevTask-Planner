/** ======= MUI COMPONENTS ======= */
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

/** ======= CONTEXT ======= */
import { useFeedback } from '../contexts/FeedbackContext';


/** @description The global snack bar for success, error states */
const GlobalSnackbar = () => {
    /** ======= GET FEEDBACK CONTEXT ======= */
    const { message, type, clearFeedback } = useFeedback();
    return (
        <Snackbar
            open={!!message}
            autoHideDuration={4000}
            onClose={clearFeedback}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <MuiAlert severity={type} onClose={clearFeedback} elevation={6} variant="filled">
                {message}
            </MuiAlert>
        </Snackbar>
    );
};


export default GlobalSnackbar;