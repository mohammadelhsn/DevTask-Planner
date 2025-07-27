import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();
    return (
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
            <Button variant="contained" onClick={() => navigate('/')}>
                Go to Home
            </Button>
        </Box>
    );
}
