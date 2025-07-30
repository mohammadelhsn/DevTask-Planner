/** ======= REACT ROUTER ======= */
import { useNavigate } from 'react-router-dom';

/** ======= MUI COMPONENTS ======= */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import { useAuth } from '../contexts/AuthContext';

/** @description Renders when the page is non existent */
const NotFoundPage = () => {
    const { loading } = useAuth();
    const navigate = useNavigate();
    const navigateBack = () => navigate(-1);
    return (
        <Fade in={!loading} timeout={500}>
            <Box
                sx={{
                    height: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    px: 2,
                }}
            >
                <Typography variant="h1" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Oops! The page you are looking for doesn’t exist.
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, maxWidth: 400 }}>
                    It might have been moved or deleted, or you may have typed the URL incorrectly.
                </Typography>
                <Button variant="contained" onClick={navigateBack}>
                    Go Back
                </Button>
            </Box>
        </Fade>
    );
};

export default NotFoundPage;