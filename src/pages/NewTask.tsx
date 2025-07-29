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
// import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

/** ========== DATA / FIREBASE ========== */
import { createTask } from '../data/Tasks';
import { type ColumnType, type TaskObject } from '../data/Types';
import { VIEW_TASK } from '../data/Routes';
import type { ProjectWrapper } from '../data/Project';
import LayoutContainer from '../components/LayoutContainer';



const steps = ['Project Title', 'Settings & Config'];

const lifecycles = ['alpha', 'beta', 'stable'] as const;
const types = ['feature', 'bug'] as const;
const priorities = ['high', 'medium', 'low'] as const;


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
    const { user, userData } = useContext(AuthContext);
    const navigate = useNavigate();
    const navigateToNewTask = (projectId: string, taskId: string) => navigate(VIEW_TASK(projectId, taskId));
    const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
    if (!id) {
        return;
    }
    useEffect(() => {
        if (user && userData) {
            const proj = userData.findProject(id);
            if (proj) setProject(proj);
        }
    }, [user, userData, id]);
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
            createdAt: new Date(),
            lastUpdated: new Date(),
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
        <LayoutContainer backIcon>
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
                                        <Select value={column} label="Column" required onChange={(e) => setColumn(e.target.value)}>
                                            {project.config.map((option, index) => (
                                                option.enabled && (
                                                    <MenuItem key={`${option.id}-${index}-newTask`} value={option.id}>
                                                        {option.label}
                                                    </MenuItem>
                                                )
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Lifecycle</InputLabel>
                                        <Select value={lifecycle} label="Lifecycle" onChange={(e) => setLifecycle(e.target.value)}>
                                            {lifecycles.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Type</InputLabel>
                                        <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
                                            {types.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Priority</InputLabel>
                                        <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value)}>
                                            {priorities.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
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
    );
};

export default NewTask;