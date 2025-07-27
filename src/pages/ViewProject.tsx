import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventIcon from '@mui/icons-material/Event';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { ProjectWrapper } from '../data/Project';
import { useFeedback } from '../contexts/FeedbackContext';
import InboxIcon from '@mui/icons-material/Inbox';
import { capitalize } from '../data/Functions';
import { dividerStyle } from '../data/Styles';

const columnCards = {
    height: { sm: '60vh', md: 'fit-content' },
    width: { xs: '100%', sm: '280px', md: '340px', lg: '400px', },
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
};


const ViewProject = () => {
    const { user, userData } = useAuth();
    const { setFeedback } = useFeedback();
    const { id } = useParams();
    const [project, setProject] = useState<ProjectWrapper | null>(null);
    project;
    useEffect(() => {
        if (!user && !userData) {
            navigate('/login');
            return;
        } else if (user && userData) {
            const proj = userData.projects.find((el) => el.id === id);
            if (proj) {
                setProject(proj);
            } else {
                setFeedback('Project not found!', 'error');
                navigate('/projects/new');
                return;
            }
        }
    });
    const navigate = useNavigate();
    const getChipColor = (type: 'feature' | 'bug') => {
        if (type == 'feature') {
            return 'primary';
        } else {
            return 'error';
        }
    };
    const getLifecycleColor = (stage: 'alpha' | 'beta' | 'stable') => {
        if (stage == 'alpha') {
            return 'warning';
        } else if (stage == 'beta') {
            return 'info';
        } else {
            return 'success';
        }
    };
    function getPriorityColor(priority: string): 'error' | 'warning' | 'success' {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
            default:
                return 'success';
        }
    }
    return (
        <Container maxWidth='lg' sx={{ flexGrow: 1 }}>
            <Box sx={{ my: 2 }}>
                <Typography variant='h2'>Dev Board - {project?.projectName}</Typography>
                <Typography variant='h5' sx={{ fontStyle: 'italic' }}>{project?.projectDesc}</Typography>
                <Divider sx={dividerStyle} />
            </Box>
            <Paper sx={{ overflowX: 'auto', maxWidth: '100%' }}>
                {project && project.tasks.length == 0 && (
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <InboxIcon fontSize='large' color='primary' sx={{ mr: 1 }} />
                        <Typography variant="h6" color="text.secondary">
                            No tasks in this project yet
                        </Typography>
                    </Box>
                )}
                {project && project.tasks.length > 0 && (
                    <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' }, minWidth: { xs: 'auto', sm: 'fit-content' }, }}>
                        {/* Column Card 1 */}
                        <Card elevation={3} sx={columnCards}>
                            <CardHeader title={
                                <>
                                    <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><ScheduleIcon color='primary' sx={{ mr: 1 }} /> Long Term</Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </>
                            } />
                            <CardContent>
                                <Stack spacing={2}>
                                    {project && project.tasks.filter((t) => t.column == 'Long Term').length == 0 && (
                                        <Typography>No Tasks here! Woohoo!</Typography>
                                    )}
                                    {project && project.tasks.length > 0 && project.tasks.filter((t) => t.column == 'Long Term').map((t, index) => {
                                        return (
                                            <Card elevation={5} key={`${t.id}-${index}`}>
                                                <CardHeader title={
                                                    <>
                                                        <Typography variant='subtitle1'>{t.title}</Typography>
                                                        <Divider sx={{ mt: 1 }} />
                                                    </>}
                                                    subheader={
                                                        <>
                                                            {t.type != null && (<Chip color={getChipColor(t.type)} size="small" label={capitalize(t.type)} sx={{ mt: 1, mr: 1 }}></Chip>)}
                                                            {t.lifecycle != null && (<Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} sx={{ mt: 1, mr: 1 }}></Chip>)}
                                                            {t.priority != null && (<Chip
                                                                variant="filled"
                                                                color={getPriorityColor(t.priority)}
                                                                label={capitalize(t.priority) + ' Priority'}
                                                                sx={{ mt: 1 }}
                                                            />)}
                                                        </>}
                                                />
                                                <CardContent sx={{ pt: 0 }}>
                                                    <Typography>{t.description}</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button onClick={() => navigate(`/project/${id}/tasks/${t.id}`)}>Edit Task</Button>
                                                </CardActions>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card elevation={3} sx={columnCards}>
                            <CardHeader title={
                                <>
                                    <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><EventIcon color='primary' sx={{ mr: 1 }} />Medium Term</Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </>
                            } />
                            <CardContent>
                                <Stack spacing={2}>
                                    {project && project.tasks.filter((t) => t.column == 'Medium Term').length == 0 && (
                                        <Typography>No Tasks here! Woohoo!</Typography>
                                    )}
                                    {project && project.tasks.length > 0 && project.tasks.filter((t) => t.column == 'Medium Term').map((t, index) => {
                                        return (
                                            <Card elevation={5} key={`${t.id}-${index}`}>
                                                <CardHeader title={
                                                    <>
                                                        <Typography variant='subtitle1'>{t.title}</Typography>
                                                        <Divider sx={{ mt: 1 }} />
                                                    </>}
                                                    subheader={
                                                        <>
                                                            {t.type != null && (<Chip color={getChipColor(t.type)} size="small" label={capitalize(t.type)} sx={{ mt: 1, mr: 1 }}></Chip>)}
                                                            {t.lifecycle != null && (<Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} sx={{ mt: 1, mr: 1 }}></Chip>)}
                                                            {t.priority != null && (<Chip
                                                                variant="filled"
                                                                color={getPriorityColor(t.priority)}
                                                                label={capitalize(t.priority) + ' Priority'}
                                                                sx={{ mt: 1 }}
                                                            />)}
                                                        </>}
                                                />
                                                <CardContent sx={{ pt: 0 }}>
                                                    <Typography>{t.description}</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button onClick={() => navigate(`/project/${id}/tasks/${t.id}`)}>Edit Task</Button>
                                                </CardActions>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card elevation={3} sx={columnCards}>
                            <CardHeader title={
                                <>
                                    <Typography variant='inherit'><FlashOnIcon color='primary' sx={{ mr: 1 }} />Short Term</Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </>
                            } />
                            <CardContent>
                                {project && project.tasks.filter((t) => t.column == 'Short Term').length == 0 && (
                                    <Typography>No Tasks here! Woohoo!</Typography>
                                )}
                                {project && project.tasks.length > 0 && project.tasks.filter((t) => t.column == 'Short Term').map((t, index) => {
                                    return (
                                        <Card elevation={5} key={`${t.id}-${index}`}>
                                            <CardHeader title={
                                                <>
                                                    <Typography variant='subtitle1'>{t.title}</Typography>
                                                    <Divider sx={{ mt: 1 }} />
                                                </>}
                                                subheader={
                                                    <>
                                                        {t.type != null && (<Chip color={getChipColor(t.type)} size="small" label={capitalize(t.type)} sx={{ mt: 1, mr: 1 }}></Chip>)}
                                                        {t.lifecycle != null && (<Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} sx={{ mt: 1, mr: 1 }}></Chip>)}
                                                        {t.priority != null && (<Chip
                                                            variant="filled"
                                                            color={getPriorityColor(t.priority)}
                                                            label={capitalize(t.priority) + ' Priority'}
                                                            sx={{ mt: 1 }}
                                                        />)}
                                                    </>}
                                            />
                                            <CardContent sx={{ pt: 0 }}>
                                                <Typography>{t.description}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button onClick={() => navigate(`/project/${id}/tasks/${t.id}`)}>Edit Task</Button>
                                            </CardActions>
                                        </Card>
                                    );
                                })}
                            </CardContent>
                        </Card>
                        <Card elevation={3} sx={columnCards}>
                            <CardHeader title={
                                <>
                                    <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><AutorenewIcon color='primary' sx={{ mr: 1 }} /> Doing</Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </>
                            } />
                            <CardContent>
                                <Stack spacing={2}>
                                    {project && project.tasks.filter((t) => t.column == 'Doing').length == 0 && (
                                        <Typography>No Tasks here! Woohoo!</Typography>
                                    )}
                                    {project && project.tasks.length > 0 && project.tasks.filter((t) => t.column == 'Doing').map((t, index) => {
                                        return (
                                            <Card elevation={5} key={`${t.id}-${index}`}>
                                                <CardHeader title={
                                                    <>
                                                        <Typography variant='subtitle1'>{t.title}</Typography>
                                                        <Divider sx={{ mt: 1 }} />
                                                    </>}
                                                    subheader={
                                                        <>
                                                            {t.type != null && (<Chip color={getChipColor(t.type)} size="small" label={capitalize(t.type)} sx={{ mt: 1, mr: 1 }}></Chip>)}
                                                            {t.lifecycle != null && (<Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} sx={{ mt: 1, mr: 1 }}></Chip>)}
                                                            {t.priority != null && (<Chip
                                                                variant="filled"
                                                                color={getPriorityColor(t.priority)}
                                                                label={capitalize(t.priority) + ' Priority'}
                                                                sx={{ mt: 1 }}
                                                            />)}
                                                        </>}
                                                />
                                                <CardContent sx={{ pt: 0 }}>
                                                    <Typography>{t.description}</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button onClick={() => navigate(`/project/${id}/tasks/${t.id}`)}>Edit Task</Button>
                                                </CardActions>
                                            </Card>
                                        );
                                    })}
                                </Stack>

                            </CardContent>
                        </Card>
                        <Card elevation={3} sx={columnCards}>
                            <CardHeader title={
                                <Box>
                                    <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><CheckCircleIcon color='primary' sx={{ mr: 1 }} />Done</Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </Box>
                            } />
                            <CardContent>
                                <Stack spacing={2}>{project && project.tasks.filter((t) => t.column == 'Done').length == 0 && (
                                    <Typography>No Tasks here! Woohoo!</Typography>
                                )}
                                    {project && project.tasks.length > 0 && project.tasks.filter((t) => t.column == 'Done').map((t, index) => {
                                        return (
                                            <Card elevation={5} key={`${t.id}-${index}`}>
                                                <CardHeader title={
                                                    <>
                                                        <Typography variant='subtitle1'>{t.title}</Typography>
                                                        <Divider sx={{ mt: 1 }} />
                                                    </>}
                                                    subheader={
                                                        <>
                                                            {t.type != null && (<Chip color={getChipColor(t.type)} size="small" label={capitalize(t.type)} sx={{ mt: 1, mr: 1 }}></Chip>)}
                                                            {t.lifecycle != null && (<Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} sx={{ mt: 1, mr: 1 }}></Chip>)}
                                                            {t.priority != null && (<Chip
                                                                variant="filled"
                                                                color={getPriorityColor(t.priority)}
                                                                label={capitalize(t.priority) + ' Priority'}
                                                                sx={{ mt: 1 }}
                                                            />)}
                                                        </>}
                                                />
                                                <CardContent sx={{ pt: 0 }}>
                                                    <Typography>{t.description}</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button onClick={() => navigate(`/project/${id}/tasks/${t.id}`)}>Edit Task</Button>
                                                </CardActions>
                                            </Card>
                                        );
                                    })}</Stack>
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
                    <AddIcon className="spin-icon" sx={{
                        transition: 'transform 0.8s ease',
                        transformOrigin: 'center',
                    }} />
                </Fab>
            </Box>
        </Container>
    );
};

export default ViewProject;