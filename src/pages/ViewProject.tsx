/** ======= React & Router ======= **/
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/** ======= MUI Components ======= **/
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

/** ======= MUI Icons ======= **/
import { ScheduleIcon, EventIcon, FlashOnIcon, AutorenewIcon, CheckCircleIcon, AddIcon, InboxIcon, LazyIcon } from '../components/LazyIcons';
import Fab from '@mui/material/Fab';

/** ======= Contexts ======= **/
import { useAuth } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';

/** ======= Project-specific Imports ======= **/
import type { ProjectWrapper } from '../data/Project';
import { columnCards, containerStyles, divCenter, dividerStyle } from '../data/Styles';
import { NEW_PROJECT } from '../data/Routes';
import TaskCard from '../components/TaskCard';
import NoTasks from '../components/NoTasks';


const ViewProject = () => {
    /** ======= GET AUTH STATE ======= */
    const { user, userData } = useAuth();
    /** ======= GET THE GLOBAL SNACKBAR CONTEXT ======= */
    const { setFeedback } = useFeedback();
    /** ======= GET URL PARAMS */
    const { id } = useParams();
    /** ======= DEFINE STATE FOR PROJECT ======= */
    const [project, setProject] = useState<ProjectWrapper | null>(null);
    /**  */
    const navigate = useNavigate();
    const navigateToNewProject = () => navigate(NEW_PROJECT);
    useEffect(() => {
        if (user && userData) {
            if (id) {
                const proj = userData.findProject(id);
                if (proj) {
                    setProject(proj);
                } else {
                    setFeedback('Project not found!', 'error');
                    navigateToNewProject();
                    return;
                }
            }
        }
    });
    if (!id) return (<Typography>An ID must be included</Typography>);
    return (
        <Container maxWidth='lg' sx={containerStyles}>
            <Box sx={{ my: 2 }}>
                <Typography variant='h2'>Dev Board - {project?.projectName}</Typography>
                <Typography variant='h5' sx={{ fontStyle: 'italic' }}>{project?.projectDesc}</Typography>
                <Divider sx={dividerStyle} />
            </Box>
            <Paper sx={{ overflowX: 'auto', maxWidth: '100%' }}>
                {project && project.tasks.length == 0 && (
                    <Box p={2} sx={{ ...divCenter }}>
                        <LazyIcon icon={InboxIcon} fontSize='large' color='primary' sx={{ mr: 1 }} />
                        <Typography variant="h6" color="text.secondary">No tasks in this project yet</Typography>
                    </Box>
                )}
                {project && project.tasks.length > 0 && (
                    <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' }, minWidth: { xs: 'auto', sm: 'fit-content' }, }}>
                        <Card elevation={3} sx={columnCards}>
                            <CardHeader title={
                                <>
                                    <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={ScheduleIcon} color='primary' sx={{ mr: 1 }} /> Long Term</Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </>
                            } />
                            <CardContent>
                                <Stack spacing={2}>
                                    {project && project.tasks.filter((t) => t.column == 'Long Term').length == 0 && (<NoTasks />)}
                                    {project && project.tasks.length > 0 && project.tasks.filter((t) => t.column == 'Long Term').map((t, index) => (<TaskCard t={t} index={index} projectId={id} />))}
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card elevation={3} sx={columnCards}>
                            <CardHeader title={
                                <>
                                    <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={EventIcon} color='primary' sx={{ mr: 1 }} />Medium Term</Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </>
                            } />
                            <CardContent>
                                <Stack spacing={2}>
                                    {project && project.tasks.filter((t) => t.column == 'Medium Term').length == 0 && (<NoTasks />)}
                                    {project && project.tasks.length > 0 && project.tasks.filter((t) => t.column == 'Medium Term').map((t, index) => (<TaskCard t={t} index={index} projectId={id} />))}
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card elevation={3} sx={columnCards}>
                            <CardHeader title={
                                <>
                                    <Typography variant='inherit'><LazyIcon icon={FlashOnIcon} color='primary' sx={{ mr: 1 }} />Short Term</Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </>
                            } />
                            <CardContent>
                                {project && project.tasks.filter((t) => t.column == 'Short Term').length == 0 && (<NoTasks />)}
                                {project && project.tasks.length > 0 && project.tasks.filter((t) => t.column == 'Short Term').map((t, index) => (<TaskCard t={t} index={index} projectId={id} />))}
                            </CardContent>
                        </Card>
                        <Card elevation={3} sx={columnCards}>
                            <CardHeader title={
                                <>
                                    <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={AutorenewIcon} color='primary' sx={{ mr: 1 }} /> Doing</Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </>
                            } />
                            <CardContent>
                                <Stack spacing={2}>
                                    {project && project.tasks.filter((t) => t.column == 'Doing').length == 0 && (<NoTasks />)}
                                    {project && project.tasks.length > 0 && project.tasks.filter((t) => t.column == 'Doing').map((t, index) => (<TaskCard t={t} index={index} projectId={id} />))}
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card elevation={3} sx={columnCards}>
                            <CardHeader title={
                                <Box>
                                    <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={CheckCircleIcon} color='primary' sx={{ mr: 1 }} />Done</Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </Box>
                            } />
                            <CardContent>
                                <Stack spacing={2}>
                                    {project && project.tasks.filter((t) => t.column == 'Done').length == 0 && (<NoTasks />)}
                                    {project && project.tasks.length > 0 && project.tasks.filter((t) => t.column == 'Done').map((t, index) => (<TaskCard t={t} index={index} projectId={id} />))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                )}
            </Paper>
            <Box sx={{
                position: 'fixed',
                bottom: 120,
                right: 24,
                zIndex: 1000,
            }}>
                <Fab color="primary" aria-label="add" onClick={() => navigate(`/project/${id}/tasks/new`)}
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

export default ViewProject;