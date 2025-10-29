/** ======= REACT + ROUTER ======= */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** ======= CONTEXTS ======= */
import { useAuth } from '../contexts/useAuth';
import { useFeedback } from '../contexts/useFeedback';

/** ======= MUI COMPONENTS ======= */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';

/** ======= FIREBASE ======= */
import { GithubAuthProvider, GoogleAuthProvider, FacebookAuthProvider, type AuthProvider } from 'firebase/auth';
import { handleProviderSignUp } from '../data/Firebase';

/** ======= ICONS ======= */
import { FaGithub, FaFacebook, FaGoogle, } from 'react-icons/fa';

/** ======= PROJECT FILES ======= */
import { combinedStyles, providerButton } from '../data/Styles';
import { DASHBOARD } from '../data/Routes';
import type { LoginButtonState, ProviderName } from '../data/Types';

/** ======= PROVIDER INSTANCE =======*/
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/** ======= CURRENT ACTION ======= */
const action = 'Sign Up';
const hidden = true;

/**   The Sign Up page */
const SignUpPage = () => {
    /** ======= GLOBAL SNACKBAR ======= */
    const { setFeedback } = useFeedback();
    /** ======= THEME ======= */
    const { palette } = useTheme();
    /** ======= AUTH CONTEXT ======= */
    const { user, loading, userData } = useAuth();
    /** ======= LOADING STATE FOR EACH PROVIDER BUTTON ======= */
    const [loadingButton, setLoadingButton] = useState<LoginButtonState>({
        google: false,
        github: false,
        facebook: false,
    });
    const navigate = useNavigate();
    /** ======= CHECK IF THERE IS A USER ======= */
    useEffect(() => {
        if (!loading && userData && user) navigate(DASHBOARD);
    }, [user, userData, loading, navigate]);
    /** ======= HANDLE LOADING STATE ======= */
    if (loading) return <Typography>Loading...</Typography>;
    /** ======= PROVIDER METHODS ======= */
    const setProviderLoading = (provider: ProviderName, value: boolean) => {
        setLoadingButton((prev) => ({ ...prev, [provider]: value }));
    };
    const handleProviderSignUpWrapper = async (provider: AuthProvider, providerName: ProviderName) => {
        setProviderLoading(providerName, true);
        const result = await handleProviderSignUp(provider);
        setFeedback(result.message, result.success ? 'success' : 'error');
        setProviderLoading(providerName, false);
        if (result.success) navigate(DASHBOARD);
    };
    const handleGoogleSignUp = () => handleProviderSignUpWrapper(googleProvider, 'google');
    const handleGitHubSignUp = () => handleProviderSignUpWrapper(githubProvider, 'github');
    const handleFacebookSignUp = () => handleProviderSignUpWrapper(facebookProvider, 'facebook');
    /** ======= COMPONENT ======= */
    return (
        <Container
            maxWidth="lg"
            sx={combinedStyles}
        >
            <Card sx={{ width: '100%', maxWidth: 500, p: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Typography variant="h4">{action}</Typography>
                    <Divider sx={{ mb: 4 }} />
                    <Button
                        variant='outlined'
                        fullWidth
                        loading={loadingButton.google}
                        onClick={handleGoogleSignUp}
                        startIcon={<FaGoogle color={palette.text.primary} />}
                        sx={providerButton}
                    >
                        {action} with Google
                    </Button>
                    {/** Disabled for now because it hasn't been configured for this project yet */}
                    {!hidden && (
                        <Button
                            variant='outlined'
                            onClick={handleGitHubSignUp}
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
                            onClick={handleFacebookSignUp}
                            startIcon={<FaFacebook color={palette.text.primary} />}
                            loading={loadingButton.facebook}
                            sx={providerButton}
                        >
                            {action} with Facebook
                        </Button>
                    )}

                </Box>
            </Card>
        </Container>
    );
};

export default SignUpPage;