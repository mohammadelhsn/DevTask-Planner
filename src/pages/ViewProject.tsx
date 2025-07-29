/** ======= React & Router ======= **/
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/** ======= MUI Components ======= **/
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
import { columnCards, divCenter } from '../data/Styles';
import { NEW_PROJECT } from '../data/Routes';
import TaskCard from '../components/TaskCard';
import NoTasks from '../components/NoTasks';
import type { ColumnType, LazyIconType } from '../data/Types';
import LayoutContainer from '../components/LayoutContainer';
import PageTitle from '../components/PageTitle';

const icons: Record<Exclude<ColumnType, null>, LazyIconType> = {
    "Uncategorized": InboxIcon,
    "Long Term": ScheduleIcon,
    "Medium Term": EventIcon,
    "Short Term": FlashOnIcon,
    "Doing": AutorenewIcon,
    "Done": CheckCircleIcon
};


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
    }, [user, userData, id]);
    if (!id) return (<Typography>An ID must be included</Typography>);
    return (
        <LayoutContainer backIcon>
            <PageTitle title={`Dev Board - ${project?.projectName}`} desc={project?.projectDesc} divider />
            <Paper sx={{ overflowX: 'auto', maxWidth: '100%' }}>
                {project && project.tasks.length == 0 && (
                    <Box p={2} sx={{ ...divCenter }}>
                        <LazyIcon icon={InboxIcon} fontSize='large' color='primary' sx={{ mr: 1 }} />
                        <Typography variant="h6" color="text.secondary">No tasks in this project yet</Typography>
                    </Box>
                )}
                {project && project.tasks.length > 0 && (
                    <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' }, minWidth: { xs: 'auto', sm: 'fit-content' }, }}>
                        {project.config.map((col, index) => {
                            const columnTasks = project.tasks.filter((t) => t.column === col.id);
                            return (
                                <Card elevation={3} sx={columnCards} key={`${col.id}-${index}-ViewProject`}>
                                    <CardHeader title={
                                        <>
                                            <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={icons[col.id]} color='primary' sx={{ mr: 1 }} />{col.label}</Typography>
                                            <Divider sx={{ mt: 1 }} />
                                        </>
                                    } />
                                    <CardContent>
                                        <Stack spacing={2}>
                                            {columnTasks.length === 0 ? <NoTasks /> : columnTasks.map((t, index) => {
                                                return (<TaskCard t={t} key={`${t.id}-${index}-ViewProject`} projectId={id} />);
                                            })}
                                        </Stack>
                                    </CardContent>
                                </Card>);
                        })}
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
        </LayoutContainer>
    );
};

export default ViewProject;