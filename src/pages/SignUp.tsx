import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { GithubAuthProvider, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { handleProviderSignUp } from '../data/Firebase';
import Box from '@mui/material/Box';
import { useFeedback } from '../contexts/FeedbackContext';
import { useAuth } from '../contexts/AuthContext';
import { FaGithub, FaFacebook, FaGoogle } from 'react-icons/fa';

const SignUpPage = () => {
    const { setFeedback } = useFeedback();
    const { palette } = useTheme();
    const { user, loading } = useAuth();
    const [loadingG, setLoadingG] = useState<boolean>(false);
    const [loadingGH, setLoadingGH] = useState<boolean>(false);
    const [loadingF, setLoadingF] = useState<boolean>(false);
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const facebookProvider = new FacebookAuthProvider();
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);
    if (loading) return <Typography>Loading...</Typography>;
    const handleGoogleSignUp = async () => {
        setLoadingG(true);
        const result = await handleProviderSignUp(googleProvider);
        setLoadingG(false);

        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigate('/dashboard');
    };
    const handleGitHubSignUp = async () => {
        setLoadingGH(true);
        const result = await handleProviderSignUp(githubProvider);
        setLoadingGH(false);

        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigate('/dashboard');
    };
    const handleFacebookSignUp = async () => {
        setLoadingF(true);
        const result = await handleProviderSignUp(facebookProvider);
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
            <Card sx={{ width: '100%', maxWidth: 500, p: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Typography variant="h4">
                        Sign Up
                    </Typography>
                    <Divider sx={{ mb: 4 }} />
                    <Button
                        variant='outlined'
                        fullWidth
                        loading={loadingG}
                        onClick={handleGoogleSignUp}
                        startIcon={<FaGoogle color={palette.text.primary} />}
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
                        Sign Up with Google
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={handleGitHubSignUp}
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
                        Sign Up with GitHub
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={handleFacebookSignUp}
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
                        Sign Up with Facebook
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default SignUpPage;