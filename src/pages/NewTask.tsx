/** ========== REACT ========== */
import { useContext, useEffect, useState } from 'react';

/** ========== REACT ROUTER ========== */
import { useNavigate, useParams } from 'react-router-dom';

/** ========== CONTEXTS ========== */
import { AuthContext } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';

/** ========== MUI COMPONENTS ========== */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';

/** ======= Custom Components ======= */
import LayoutContainer from '../components/LayoutContainer';

/** ======= Icons ======= */
import { LazyIcon } from '../components/LazyIcons';

/** ========== DATA / FIREBASE ========== */
import { createTask } from '../data/Tasks';
import type { ColumnType, LifecycleType, TaskObject, TaskPriority, TaskType } from '../data/Types';
import { VIEW_PROJECT, VIEW_TASK } from '../data/Routes';
import type { ProjectWrapper } from '../data/Project';
import { capitalize, getChipColor, getLifecycleColor, getPriorityColor } from '../data/Functions';
import { priorities, lifecycles, types, typeIcons, lifecycleIcons, priorityIcons, categoryIcons } from '../data/Constants';

const steps = ['New Task', 'Settings & Config'];

const NewTask = () => {
    const [activeStep, setActiveStep] = useState(0);
    const { id } = useParams();
    const [project, setProject] = useState<ProjectWrapper | null>(null);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [column, setColumn] = useState('');
    const [lifecycle, setLifecycle] = useState('');
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('');
    //const [assignees, setAssignees] = useState<string[]>([]);
    const { setFeedback } = useFeedback();
    const { user, userData, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user && userData && id) {
            const proj = userData.findProject(id);
            if (proj) setProject(proj);
        }
    }, [user, userData, id]);
    const navigateToNewTask = (projectId: string, taskId: string) => navigate(VIEW_TASK(projectId, taskId));
    const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
    if (!id) return null;
    if (!project) return;
    const handleSubmit = async () => {
        if (!user) return;
        const taskToCreate: Omit<TaskObject, "id"> = {
            title: title,
            description: desc,
            column: column ? (column as ColumnType) : 'Uncategorized',
            lifecycle: lifecycle ? (lifecycle as 'alpha' | 'beta' | 'stable') : null,
            type: type ? (type as 'feature' | 'bug') : null,
            priority: priority ? (priority as 'high' | 'medium' | 'low') : null,
            assignees: [],
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            dueDate: null,
        };

        try {
            const response = await createTask(user.uid, id, taskToCreate);

            if (response.success) {
                setFeedback('Task created with ID: ' + response.data?.id, 'success');
                if (response.data) navigateToNewTask(id, response.data.id);
            } else {
                setFeedback('Failed to create project: ' + response.message, 'error');
            }
        } catch (error) {
            setFeedback('Unexpected error creating project.', 'error');
            console.error(error);
        }
    };
    return (
        <Fade in={!loading} timeout={500}>
            <div>
                <LayoutContainer backIcon to={VIEW_PROJECT(id)}>
                    <Box mt={4} sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Box sx={{ mt: 4 }}>
                            {activeStep === 0 && (
                                <>
                                    <TextField
                                        label="Title"
                                        fullWidth
                                        margin="normal"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <TextField
                                        label="Description"
                                        multiline
                                        fullWidth
                                        margin="normal"
                                        required
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button variant="contained" onClick={handleNext} disabled={!title || !desc}>
                                            Next
                                        </Button>
                                    </Box>
                                </>
                            )}

                            {activeStep === 1 && (
                                <Card sx={{ p: 2 }}>
                                    <Card elevation={3}>
                                        <CardHeader title={
                                            <>
                                                <Typography variant='inherit'>Config</Typography>
                                                <Divider sx={{ mt: 2 }} />
                                            </>
                                        } />
                                        <CardContent>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Column</InputLabel>
                                                <Select value={column} label="Column" required onChange={(e) => setColumn(e.target.value)}
                                                    renderValue={(selected) => (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <LazyIcon
                                                                icon={categoryIcons[(selected as Exclude<ColumnType, null>)]}
                                                                color={'primary'}
                                                                sx={{ mr: 1 }}
                                                            />
                                                            {capitalize(selected)}
                                                        </Box>
                                                    )}>
                                                    {project.config.map((option, index) => (
                                                        option.enabled && (
                                                            <MenuItem key={`${option.id}-${index}-newTask`} value={option.id} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <LazyIcon icon={categoryIcons[option.id]} color={'primary'} sx={{ mr: 1 }} />{capitalize(option.label)}
                                                            </MenuItem>
                                                        )
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Lifecycle</InputLabel>
                                                <Select value={lifecycle} label="Lifecycle" onChange={(e) => setLifecycle(e.target.value)}
                                                    renderValue={(selected) => (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <LazyIcon
                                                                icon={lifecycleIcons[(selected as Exclude<LifecycleType, null>)]}
                                                                color={getLifecycleColor((selected as Exclude<LifecycleType, null>))}
                                                                sx={{ mr: 1 }}
                                                            />
                                                            {capitalize(selected)}
                                                        </Box>
                                                    )}>
                                                    {lifecycles.map(option => (
                                                        <MenuItem key={option} value={option} sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={lifecycleIcons[option]} color={getLifecycleColor(option)} sx={{ mr: 1 }} />{capitalize(option)}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Type</InputLabel>
                                                <Select value={type} label="Type" onChange={(e) => setType(e.target.value)} renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <LazyIcon
                                                            icon={typeIcons[(selected as Exclude<TaskType, null>)]}
                                                            color={getChipColor((selected as Exclude<TaskType, null>))}
                                                            sx={{ mr: 1 }}
                                                        />
                                                        {capitalize(selected)}
                                                    </Box>
                                                )}>
                                                    {types.map(option => (
                                                        <MenuItem key={option} value={option} sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={typeIcons[option]} color={getChipColor(option)} sx={{ mr: 1 }} />{capitalize(option)}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Priority</InputLabel>
                                                <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value)} renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <LazyIcon
                                                            icon={priorityIcons[(selected as Exclude<TaskPriority, null>)]}
                                                            color={getPriorityColor((selected as Exclude<TaskPriority, null>))}
                                                            sx={{ mr: 1 }}
                                                        />
                                                        {capitalize(selected)}
                                                    </Box>
                                                )}>
                                                    {priorities.map(option => (
                                                        <MenuItem key={option} value={option} sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={priorityIcons[option]} color={getPriorityColor(option)} sx={{ mr: 1 }} />{capitalize(option)}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            {/* Assignees would typically be a multi-select with user emails/names */}
                                        </CardContent>
                                    </Card>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                        <Button variant="outlined" onClick={handleBack}>Back</Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                </Card>
                            )}
                        </Box>
                    </Box>
                </LayoutContainer>
            </div>
        </Fade>

    );
};

export default NewTask;