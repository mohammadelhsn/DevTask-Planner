/** ======= MUI COMPONENTS ======= */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';

/** ======= REACT ======= */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** ======= FIREBASE & AUTH ======= */
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { handleProviderSignIn } from '../data/Firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';

/** ======= ICONS ======= */
import { FaGithub, FaFacebook, FaGoogle, } from 'react-icons/fa';

/** ======= STYLES & ROUTES ======= */
import { combinedStyles, providerButton } from '../data/Styles';
import { DASHBOARD } from '../data/Routes';


/** ======= LOGIN ======= */

const LogIn = () => {
    /** ======= AUTH CONTEXT ======= */
    const { user, loading } = useAuth();
    /** ======= GENERAL FEEDBACK PROVIDER ======= */
    const { setFeedback } = useFeedback();
    /** ======= THEME CONTEXT ======= */
    const { palette } = useTheme();
    /** =========== LOADING STATE FOR EACH OF THE BUTTONS =========== */
    const [loadingG, setLoadingG] = useState<boolean>(false);
    const [loadingGH, setLoadingGH] = useState<boolean>(false);
    const [loadingF, setLoadingF] = useState<boolean>(false);
    /** ======= NAVIGATE HOOK ======= */
    const navigate = useNavigate();
    const navigateToDashboard = () => navigate(DASHBOARD);
    /** =========== INITIATE THE PROVIDERS =========== */
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const facebookProvider = new FacebookAuthProvider();
    useEffect(() => {
        if (user) {
            navigateToDashboard();
        }
    }, [user, navigate]);
    /** ======= HANDLE LOADING ======= */
    if (loading) return <Typography>Loading...</Typography>;
    /** ======= DEFINE THE ACTION ======= */
    const action = 'Log In';
    /** ======= PROVIDER HANDLERS ======= */
    const handleGoogleSignIn = async () => {
        setLoadingG(true);
        const result = await handleProviderSignIn(googleProvider);
        setLoadingG(false);
        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigateToDashboard();
    };
    const handleGitHubSignIn = async () => {
        setLoadingGH(true);
        const result = await handleProviderSignIn(githubProvider);
        setLoadingGH(false);
        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigateToDashboard();
    };
    const handleFacebookSignIn = async () => {
        setLoadingF(true);
        const result = await handleProviderSignIn(facebookProvider);
        setLoadingF(false);
        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigateToDashboard();
    };
    return (
        <Container
            maxWidth="lg"
            sx={combinedStyles}
        >
            <Paper sx={{ width: '100%', maxWidth: 500, p: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Typography variant="h4">Log In</Typography>
                    <Divider sx={{ mb: 4 }} />
                    <Button
                        variant='outlined'
                        onClick={handleGoogleSignIn}
                        startIcon={<FaGoogle color={palette.text.primary} />}
                        loading={loadingG}
                        sx={providerButton}
                    >
                        {action} with Google
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={handleGitHubSignIn}
                        startIcon={<FaGithub color={palette.text.primary} />}
                        loading={loadingGH}
                        sx={providerButton}
                    >
                        {action} with GitHub
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={handleFacebookSignIn}
                        startIcon={<FaFacebook color={palette.text.primary} />}
                        loading={loadingF}
                        sx={providerButton}
                    >
                        {action} with Facebook
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LogIn;