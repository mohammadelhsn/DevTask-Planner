/** ======= MUI COMPONENTS ======= */
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

/** ======= MUI ICONS ======= */
import { AddIcon, LazyIcon } from '../components/LazyIcons';

/** ======= REACT ROUTER ======= */
import { useNavigate } from 'react-router-dom';

/** ======= CONTEXTS ======= */
import { useAuth } from '../contexts/AuthContext';

/** ======= PROJECT FILES ======= */
import { NEW_PROJECT } from '../data/Routes';
import ProjectCard from '../components/ProjectCard';
import NoProjectsMessage from '../components/NoProjects';
import LayoutContainer from '../components/LayoutContainer';
import PageTitle from '../components/PageTitle';
import LoadingPage from './LoadingPage';


const Dashboard = () => {
    /** ======= NAVIGATE HOOK ======= */
    const navigate = useNavigate();
    /** ======= NAVIGATION HELPERS ======= */
    const navigateToNewProject = () => navigate(NEW_PROJECT);
    /** ======= AUTH CONTEXT ======= */
    const { loading, userData, user } = useAuth();
    /** ======= HANDLE LOADING ======= */
    if (loading) return <LoadingPage />;
    if (!user || !userData) return <LoadingPage />;
    return (
        <LayoutContainer>
            <PageTitle title={`Welcome, ${userData?.name}!`} divider />
            <Paper sx={{ p: 2 }}>
                {userData.projects.length == 0 && (<NoProjectsMessage />)}
                <Grid container spacing={3}>
                    {userData.projects.map((proj, index) => ((<ProjectCard key={`${index}-${proj.id}`} proj={proj} />)))}
                </Grid>
            </Paper>
            <Box sx={{
                position: 'fixed',
                bottom: 120,
                right: 24,
                zIndex: 1000,
            }}>
                <Fab color="primary" aria-label="add" onClick={navigateToNewProject}
                    sx={{
                        '&:hover .spin-icon': {
                            transform: 'rotate(180deg) scale(1.2)',
                            transition: 'transform 0.3s ease',
                        },
                        transition: '0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.2)'
                        }
                    }}
                >
                    <LazyIcon icon={AddIcon} className="spin-icon" sx={{
                        transition: 'transform 0.8s ease',
                        transformOrigin: 'center',
                    }} />
                </Fab>
            </Box>
        </LayoutContainer>
    );
};

export default Dashboard;