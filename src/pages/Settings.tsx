import type React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import SettingsIcon from '@mui/icons-material/Settings';

import { useAuth } from '../contexts/AuthContext';

/** =========== FIREBASE =========== */
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../data/Firebase';
import { useFeedback } from '../contexts/FeedbackContext';
import FirestoreResponse from '../data/FirestoreResponse';
import type { FirebaseError } from 'firebase/app';


interface SettingsProps {
    mode: 'light' | 'dark';
    toggleColorMode: (newMode: any) => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ mode, toggleColorMode }) => {
    const { user, userData } = useAuth();
    const { setFeedback } = useFeedback();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user && userData == null) {
            navigate('/login');
            return;
        }
        if (userData != null) {
            if (userData.theme == 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                mode = prefersDark ? 'dark' : 'light';
            } else {
                mode = userData.theme as ('dark' | 'light');
            }
        }
    });
    async function updateTheme() {
        if (user && userData) {
            const userRef = doc(db, "users", user.uid);
            try {
                await updateDoc(userRef, { theme: userData.theme });
                setFeedback(`Successfully updated theme to ${userData.theme.toUpperCase()}`, 'success');
            } catch (e: unknown) {
                setFeedback(new FirestoreResponse(e as Error | FirebaseError).message, 'error');
                console.error(e);
            }
        }
    }
    const handleChange = (_: any, newMode: 'light' | 'dark') => {
        if (!newMode) return;

        if (newMode) {
            toggleColorMode(newMode);
            if (userData) {
                userData.theme = newMode;
                updateTheme();
            }
        }
    };
    return (
        <Container
            maxWidth="lg"
            sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 4, sm: 6 },
                flexGrow: 1,
            }}>
            <Typography variant='h2' sx={{ display: 'flex', alignItems: 'center' }} ><SettingsIcon color='primary' fontSize='inherit' sx={{ mr: 1 }} />Settings</Typography>
            <Divider sx={{ my: 4 }} />
            <Card>
                <CardHeader title={<><Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><Brightness6Icon sx={{ mr: 1 }} color='primary' /> Theme Settings</Typography><Divider sx={{ my: 2 }} /></>} />
                <CardContent>
                    <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={handleChange}
                        size="small"
                        color="primary"
                    >
                        <ToggleButton value="light">
                            <LightModeIcon sx={{ mx: 1 }} />
                            <Typography>Light</Typography>
                        </ToggleButton>
                        <ToggleButton value="dark">
                            <DarkModeIcon sx={{ mx: 1 }} />
                            <Typography>Dark</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </CardContent>
            </Card>
        </Container>
    );
};
export default SettingsPage;