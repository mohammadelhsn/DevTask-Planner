import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function StarWarsNotFound() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                height: '100vh',
                backgroundColor: 'black',
                color: '#ffe81f', // Star Wars yellow
                overflow: 'hidden',
                fontFamily: "'SF Distant Galaxy', sans-serif", // use a Star Wars font if you add it
                perspective: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
            }}
        >
            <Box
                sx={{
                    animation: 'crawl 60s linear infinite',
                    fontSize: '1.5rem',
                    maxWidth: 600,
                    textAlign: 'center',
                    transformOrigin: '50% 100%',
                }}
            >
                <p>404</p>
                <p>These aren't the droids you're looking for.</p>
                <p>But hey, the Force is strong with you for finding this page!</p>
                <p>Use the button below to navigate back to safety.</p>
            </Box>
            <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 4 }}
                onClick={() => navigate('/')}
            >
                Return to the Home System
            </Button>

            <style>
                {`
          @keyframes crawl {
            0% {
              transform: translateY(100%) rotateX(20deg);
            }
            100% {
              transform: translateY(-150%) rotateX(25deg);
            }
          }
        `}
            </style>
        </Box>
    );
}
