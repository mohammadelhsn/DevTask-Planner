import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useFeedback } from '../contexts/FeedbackContext';

const GlobalSnackbar = () => {
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