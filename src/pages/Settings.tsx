/** ======= REACT ======= */
import type React from 'react';
import { useEffect } from 'react';

/** ======= CONTEXTS ======= */
import { useAuth } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';

/** ======= MUI COMPONENTS ======= */
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';

/** ======= MUI ICONS ======= */
import { Brightness6Icon, DarkModeIcon, LightModeIcon, SettingsIcon, LazyIcon } from '../components/LazyIcons';

/** ======= FIREBASE ======= */
import { doc, updateDoc } from 'firebase/firestore';
import type { FirebaseError } from 'firebase/app';
import { db } from '../data/Firebase';
import FirestoreResponse from '../data/FirestoreResponse';

/** ======= TYPES ======= */
import type { SettingsProps } from '../data/Types';
import LayoutContainer from '../components/LayoutContainer';
import PageTitle from '../components/PageTitle';


const SettingsPage: React.FC<SettingsProps> = ({ mode, toggleColorMode }) => {
    const { user, userData, loading } = useAuth();
    const { setFeedback } = useFeedback();
    useEffect(() => {
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
        <Fade in={!loading} timeout={500}>
            <div>
                <LayoutContainer backIcon>
                    <PageTitle title="Settings" icon={SettingsIcon} divider />
                    <Card>
                        <CardHeader title={<><Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={Brightness6Icon} sx={{ mr: 1 }} color='primary' /> Theme Settings</Typography><Divider sx={{ my: 2 }} /></>} />
                        <CardContent>
                            <ToggleButtonGroup
                                value={mode}
                                exclusive
                                onChange={handleChange}
                                size="small"
                                color="primary"
                            >
                                <ToggleButton value="light">
                                    <LazyIcon icon={LightModeIcon} sx={{ mx: 1 }} />
                                    <Typography>Light</Typography>
                                </ToggleButton>
                                <ToggleButton value="dark">
                                    <LazyIcon icon={DarkModeIcon} sx={{ mx: 1 }} />
                                    <Typography>Dark</Typography>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </CardContent>
                    </Card>
                </LayoutContainer>
            </div>
        </Fade>
    );
};
export default SettingsPage;