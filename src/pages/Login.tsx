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
import { type AuthProvider } from 'firebase/auth';
import { handleProviderSignIn } from '../data/Firebase';
import { useAuth } from '../contexts/useAuth';
import { useFeedback } from '../contexts/useFeedback';

/** ======= ICONS ======= */
import { FaGithub, FaFacebook, FaGoogle, } from 'react-icons/fa';

/** ======= STYLES & ROUTES ======= */
import { combinedStyles, providerButton } from '../data/Styles';
import type { LoginButtonState, ProviderName } from '../data/Types';
import { DASHBOARD } from '../data/Routes';
import LoadingPage from './LoadingPage';

/** =========== INITIATE THE PROVIDERS =========== */
import { googleProvider, githubProvider, facebookProvider } from '../data/Constants';

/** ======= DEFINE THE ACTION ======= */
const action = 'Log In';
const hidden = true;


/** ======= LOGIN ======= */

const LogIn = () => {
    /** =========== AUTH CONTEXT =========== */
    const { user, loading, userData } = useAuth();
    /** =========== GENERAL FEEDBACK PROVIDER =========== */
    const { setFeedback } = useFeedback();
    /** =========== THEME CONTEXT =========== */
    const { palette } = useTheme();
    /** =========== LOADING STATE FOR EACH OF THE BUTTONS =========== */
    const [loadingButton, setLoadingButton] = useState<LoginButtonState>({
        google: false,
        github: false,
        facebook: false,
    });
    const setProviderLoading = (provider: ProviderName, value: boolean) => {
        setLoadingButton((prev) => ({ ...prev, [provider]: value }));
    };
    /** =========== NAVIGATE HOOK =========== */
    const navigate = useNavigate();
    /** =========== HANDLE LOADING =========== */
    useEffect(() => {
        if (!loading && user && userData) navigate(DASHBOARD);
    }, [loading, user, userData, navigate]);
    /** =========== PROVIDER HANDLERS =========== */
    if (loading) return <LoadingPage />;
    const handleProviderSignInWrapper = async (provider: AuthProvider, providerName: ProviderName) => {
        setProviderLoading(providerName, true);
        const result = await handleProviderSignIn(provider);
        setFeedback(result.message, result.success ? 'success' : 'error');
        setProviderLoading(providerName, false);
    };
    const handleGoogleSignIn = () => handleProviderSignInWrapper(googleProvider, 'google');
    const handleGitHubSignIn = () => handleProviderSignInWrapper(githubProvider, 'github');
    const handleFacebookSignIn = () => handleProviderSignInWrapper(facebookProvider, 'facebook');
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
                        loading={loadingButton.google}
                        sx={providerButton}
                    >
                        {action} with Google
                    </Button>
                    {/** Disabled for now because it hasn't been configured for this project yet */}
                    {!hidden && (
                        <Button
                            variant='outlined'
                            onClick={handleGitHubSignIn}
                            startIcon={<FaGithub color={palette.text.primary} />}
                            loading={loadingButton.github}
                            sx={providerButton}
                        >
                            {action} with GitHub
                        </Button>
                    )}
                    {/** Disabled for now because it hasn't been configured for this project yet */}
                    {!hidden && (
                        <Button
                            variant='outlined'
                            onClick={handleFacebookSignIn}
                            startIcon={<FaFacebook color={palette.text.primary} />}
                            loading={loadingButton.facebook}
                            sx={providerButton}
                            disabled={true}

                        >
                            {action} with Facebook
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default LogIn;