/** MUI COMPONENTS */

import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

/** REACT */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** FIREBASE */

import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';
import { handleProviderSignIn } from '../data/Firebase';
import { useTheme } from '@mui/material';
import { FaGithub, FaFacebook, FaGoogle } from 'react-icons/fa';

/** LOGIN */

const LogIn = () => {
    /** AUTH CONTEXT */
    const { user, loading } = useAuth();
    /** GENERAL FEEDBACK PROVIDER */
    const { setFeedback } = useFeedback();
    /** THEME CONTEXT */
    const { palette } = useTheme();

    /** =========== LOADING STATE FOR EACH OF THE BUTTONS =========== */
    const [loadingG, setLoadingG] = useState<boolean>(false);
    const [loadingGH, setLoadingGH] = useState<boolean>(false);
    const [loadingF, setLoadingF] = useState<boolean>(false);

    const navigate = useNavigate();

    /** =========== INITIATE THE PROVIDERS =========== */
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const facebookProvider = new FacebookAuthProvider();
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }

    }, [user, navigate]);

    if (loading) return <Typography>Loading...</Typography>;
    const action = 'Log In';
    const handleGoogleSignIn = async () => {
        setLoadingG(true);
        const result = await handleProviderSignIn(googleProvider);
        setLoadingG(false);

        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigate('/dashboard');
    };
    const handleGitHubSignIn = async () => {
        setLoadingGH(true);
        const result = await handleProviderSignIn(githubProvider);
        setLoadingGH(false);

        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigate('/dashboard');
    };
    const handleFacebookSignIn = async () => {
        setLoadingF(true);
        const result = await handleProviderSignIn(facebookProvider);
        setLoadingF(false);
        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigate('/dashboard');
    };
    return (
        <Container
            maxWidth="lg"
            sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 4, sm: 6 },
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
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
                        sx={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.3s ease', '&:hover': {
                                transform: 'scale(1.02)',
                                bgcolor: palette.primary.light,
                                color: palette.text.primary,
                            }
                        }}
                    >
                        {action} with Google
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={handleGitHubSignIn}
                        startIcon={<FaGithub color={palette.text.primary} />}
                        loading={loadingGH}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: '0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                bgcolor: palette.primary.light,
                                color: palette.text.primary,
                            }
                        }}
                    >
                        {action} with GitHub
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={handleFacebookSignIn}
                        startIcon={<FaFacebook color={palette.text.primary} />}
                        loading={loadingF}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: '0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                bgcolor: palette.primary.light,
                                color: palette.text.primary,
                            }
                        }}
                    >
                        {action} with Facebook
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LogIn;