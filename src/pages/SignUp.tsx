/** ======= REACT + ROUTER ======= */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** ======= CONTEXTS ======= */
import { useAuth } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';

/** ======= MUI COMPONENTS ======= */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';

/** ======= FIREBASE ======= */
import { GithubAuthProvider, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { handleProviderSignUp } from '../data/Firebase';

/** ======= ICONS ======= */
import { FaGithub, FaFacebook, FaGoogle } from 'react-icons/fa';

/** ======= PROJECT FILES ======= */
import { combinedStyles, providerButton } from '../data/Styles';
import { DASHBOARD } from '../data/Routes';

/** @description The Sign Up page */
const SignUpPage = () => {
    /** ======= GLOBAL SNACKBAR ======= */
    const { setFeedback } = useFeedback();
    /** ======= THEME ======= */
    const { palette } = useTheme();
    /** ======= AUTH CONTEXT ======= */
    const { user, loading } = useAuth();
    /** ======= LOADING STATE FOR EACH PROVIDER BUTTON ======= */
    const [loadingG, setLoadingG] = useState<boolean>(false);
    const [loadingGH, setLoadingGH] = useState<boolean>(false);
    const [loadingF, setLoadingF] = useState<boolean>(false);
    const navigate = useNavigate();
    const navigateToDashboard = () => navigate(DASHBOARD);
    /** ======= PROVIDER INSTANCE =======*/
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const facebookProvider = new FacebookAuthProvider();
    /** ======= CHECK IF THERE IS A USER ======= */
    useEffect(() => {
        if (user) {
            navigateToDashboard();
        }
    }, [user, navigate]);
    /** ======= HANDLE LOADING STATE ======= */
    if (loading) return <Typography>Loading...</Typography>;
    /** ======= CURRENT ACTION ======= */
    const action = 'Sign Up';
    /** ======= PROVIDER METHODS ======= */
    const handleGoogleSignUp = async () => {
        setLoadingG(true);
        const result = await handleProviderSignUp(googleProvider);
        setLoadingG(false);
        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigateToDashboard();
    };
    const handleGitHubSignUp = async () => {
        setLoadingGH(true);
        const result = await handleProviderSignUp(githubProvider);
        setLoadingGH(false);
        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigateToDashboard();
    };
    const handleFacebookSignUp = async () => {
        setLoadingF(true);
        const result = await handleProviderSignUp(facebookProvider);
        setLoadingF(false);
        setFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) navigateToDashboard();
    };

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
                    <Typography variant="h4">
                        {action}
                    </Typography>
                    <Divider sx={{ mb: 4 }} />
                    <Button
                        variant='outlined'
                        fullWidth
                        loading={loadingG}
                        onClick={handleGoogleSignUp}
                        startIcon={<FaGoogle color={palette.text.primary} />}
                        sx={providerButton}
                    >
                        {action} with Google
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={handleGitHubSignUp}
                        startIcon={<FaGithub color={palette.text.primary} />}
                        loading={loadingGH}
                        sx={providerButton}
                    >
                        {action} with GitHub
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={handleFacebookSignUp}
                        startIcon={<FaFacebook color={palette.text.primary} />}
                        loading={loadingF}
                        sx={providerButton}
                    >
                        {action} with Facebook
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default SignUpPage;