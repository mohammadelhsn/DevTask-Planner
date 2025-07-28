/** ======= MUI COMPONENTS ======= */
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

/** ======= MUI ICONS ======= */
import { AddIcon, LazyIcon } from '../components/LazyIcons';

/** ======= REACT ROUTER ======= */
import { useNavigate } from 'react-router-dom';

/** ======= CONTEXTS ======= */
import { useAuth } from '../contexts/AuthContext';

/** ======= PROJECT FILES ======= */
import { containerStyles, dividerStyle } from '../data/Styles';
import { NEW_PROJECT } from '../data/Routes';
import ProjectCard from '../components/ProjectCard';
import NoProjectsMessage from '../components/NoProjects';


const Dashboard = () => {
    /** ======= NAVIGATE HOOK ======= */
    const navigate = useNavigate();
    /** ======= NAVIGATION HELPERS ======= */
    const navigateToNewProject = () => navigate(NEW_PROJECT);
    /** ======= AUTH CONTEXT ======= */
    const { userData, user } = useAuth();
    /** ======= HANDLE LOADING ======= */
    return (
        <Container maxWidth='lg' sx={containerStyles}>
            <Box sx={{ mt: 2 }}>
                <Typography variant='h2'>Welcome, {userData?.name}!</Typography>
                <Divider sx={dividerStyle} />
            </Box>
            <Paper sx={{ p: 2 }}>
                {user && userData && userData.projects.length == 0 && (<NoProjectsMessage />)}
                <Grid container spacing={3}>
                    {user && userData && userData.projects.length > 0 && userData.projects.map((proj, index) => ((<ProjectCard proj={proj} index={index} />)))}
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

        </Container>
    );
};

export default Dashboard;