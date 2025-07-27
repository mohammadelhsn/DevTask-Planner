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
interface SampleTasks {
    id: number;
    title: string;
    description: string;
    column: 'Long Term' | 'Short Term' | 'Medium Term' | 'Doing' | 'Done';
    lifecycle: 'alpha' | 'beta' | 'stable';
    type: 'feature' | 'bug';
    priority: 'high' | 'medium' | 'low';
}
const sampleTasks: SampleTasks[] = [
    {
        id: 1,
        title: 'Implement Authentication',
        description: 'Set up Firebase login/signup with email and Google OAuth.',
        column: 'Long Term',
        type: 'feature',
        lifecycle: 'alpha',
        priority: 'high',
    },
    {
        id: 2,
        title: 'Dark Mode Support',
        description: 'Allow users to toggle between light and dark themes.',
        column: 'Medium Term',
        type: 'feature',
        lifecycle: 'beta',
        priority: 'medium',
    },
    {
        id: 3,
        title: 'Fix Mobile Navbar Overflow',
        description: 'Navbar overlaps content on iOS Safari browsers.',
        column: 'Short Term',
        type: 'bug',
        lifecycle: 'beta',
        priority: 'high',
    },
    {
        id: 4,
        title: 'Profile Editing',
        description: 'Enable users to update their profile picture and bio.',
        column: 'Doing',
        type: 'feature',
        lifecycle: 'alpha',
        priority: 'medium',
    },
    {
        id: 5,
        title: 'Optimize Load Times',
        description: 'Improve homepage loading speed by lazy loading images.',
        column: 'Doing',
        type: 'feature',
        lifecycle: 'beta',
        priority: 'high',
    },
    {
        id: 6,
        title: 'Fix Password Reset Email Bug',
        description: 'Reset emails sometimes fail to send; investigate and fix.',
        column: 'Doing',
        type: 'bug',
        lifecycle: 'alpha',
        priority: 'high',
    },
    {
        id: 7,
        title: 'Unit Test Coverage',
        description: 'Write unit tests for authentication and profile modules.',
        column: 'Done',
        type: 'feature',
        lifecycle: 'stable',
        priority: 'low',
    },
    {
        id: 8,
        title: 'UI Polish',
        description: 'Tweak button styles and alignments for better UX.',
        column: 'Done',
        type: 'feature',
        lifecycle: 'stable',
        priority: 'low',
    },
];


function capitalize(str: string) {
    if (typeof str !== 'string' || str.length === 0) {
        return ''; // Handle empty or non-string inputs
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

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
                <Typography variant='h2'>Dev Board</Typography>
                <Typography variant='h6' sx={{ fontStyle: 'italic' }}>PROJECT NAME GOES HERE</Typography>
                <Divider sx={{ my: 2 }} />
            </Box>
            <Paper sx={{ overflowX: 'auto', maxWidth: '100%' }}>
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
                                {sampleTasks.filter((t) => t.column == 'Long Term').map((t) => {
                                    return (
                                        <Card elevation={5}>
                                            <CardHeader title={
                                                <>
                                                    <Typography variant='subtitle1'>{t.title}</Typography>
                                                    <Divider sx={{ mt: 1 }} />
                                                </>} subheader={<><Chip color={getChipColor(t.type)}
                                                    size="small" label={capitalize(t.type)} sx={{ mt: 1, mr: 1 }}></Chip>
                                                    <Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} sx={{ mt: 1, mr: 1 }}></Chip>
                                                    <Chip
                                                        variant="filled"
                                                        color={getPriorityColor(t.priority)}
                                                        label={capitalize(t.priority) + ' Priority'}
                                                        sx={{ mt: 1 }}
                                                    /></>} />
                                            <CardContent sx={{ pt: 0 }}>
                                                <Typography>{t.description}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button>Edit Task 1</Button>
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
                                {sampleTasks.filter((t) => t.column == 'Medium Term').map((t) => {
                                    return (
                                        <Card elevation={5}>
                                            <CardHeader title={
                                                <>
                                                    <Typography variant='subtitle1'>{t.title}</Typography>
                                                    <Divider sx={{ mt: 1 }} />
                                                </>} subheader={
                                                    <>
                                                        <Chip color={getChipColor(t.type)} size="small" label={capitalize(t.type)} sx={{ mt: 1, mr: 1 }}></Chip>
                                                        <Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} sx={{ mt: 1, mr: 1 }}></Chip>
                                                        <Chip
                                                            variant="filled"
                                                            color={getPriorityColor(t.priority)}
                                                            label={capitalize(t.priority) + ' Priority'}
                                                            sx={{ mt: 1 }}
                                                        />
                                                    </>
                                                } />
                                            <CardContent sx={{ pt: 0 }}>
                                                <Typography>{t.description}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button>Edit Task 1</Button>
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
                            {sampleTasks.filter((t) => t.column == 'Short Term').map((t) => {
                                return (
                                    <Card elevation={5}>
                                        <CardHeader title={
                                            <>
                                                <Typography variant='subtitle1'>{t.title}</Typography>
                                                <Divider sx={{ mt: 1 }} />
                                            </>} subheader={<><Chip color={getChipColor(t.type)}
                                                size="small" label={capitalize(t.type)} sx={{ mt: 1, mr: 1 }}></Chip>
                                                <Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} sx={{ mt: 1, mr: 1 }}></Chip>
                                                <Chip
                                                    variant="filled"
                                                    color={getPriorityColor(t.priority)}
                                                    label={capitalize(t.priority) + ' Priority'}
                                                    sx={{ mt: 1 }}
                                                /></>} />
                                        <CardContent sx={{ pt: 0 }}>
                                            <Typography>{t.description}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button>Edit Task 1</Button>
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
                                {sampleTasks.filter((t) => t.column == 'Doing').map((t) => {
                                    return (
                                        <Card elevation={5}>
                                            <CardHeader title={
                                                <>
                                                    <Typography variant='subtitle1'>{t.title}</Typography>
                                                    <Divider sx={{ mt: 1 }} />
                                                </>} subheader={<><Chip color={getChipColor(t.type)}
                                                    size="small" label={capitalize(t.type)} sx={{ mt: 1, mr: 1 }}></Chip>
                                                    <Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} sx={{ mt: 1, mr: 1 }}></Chip>
                                                    <Chip
                                                        variant="filled"
                                                        color={getPriorityColor(t.priority)}
                                                        label={capitalize(t.priority) + ' Priority'}
                                                        sx={{ mt: 1 }}
                                                    /></>} />
                                            <CardContent sx={{ pt: 0 }}>
                                                <Typography>{t.description}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button>Edit Task 1</Button>
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
                                <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><CheckCircleIcon color='primary' sx={{ mr: 1 }} />Done</Typography>
                            </>
                        } />
                        <CardContent>
                            <Stack spacing={2}>{sampleTasks.filter((t) => t.column == 'Done').map((t) => {
                                return (
                                    <Card elevation={5}>
                                        <CardHeader title={
                                            <>
                                                <Typography variant='subtitle1'>{t.title}</Typography>
                                                <Divider sx={{ mt: 1 }} />
                                            </>} subheader={<><Chip color={getChipColor(t.type)}
                                                size="small" label={capitalize(t.type)} sx={{ mt: 1, mr: 1 }}></Chip>
                                                <Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} sx={{ mt: 1, mr: 1 }}></Chip>
                                                <Chip
                                                    variant="filled"
                                                    color={getPriorityColor(t.priority)}
                                                    label={capitalize(t.priority) + ' Priority'}
                                                    sx={{ mt: 1 }}
                                                /></>} />
                                        <CardContent sx={{ pt: 0 }}>
                                            <Typography>{t.description}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button>Edit Task 1</Button>
                                        </CardActions>
                                    </Card>
                                );
                            })}</Stack>
                        </CardContent>
                    </Card>
                </Stack>
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