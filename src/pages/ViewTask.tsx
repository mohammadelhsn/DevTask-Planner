/** ======= REACT + ROUTER ======= */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/** ======= CONTEXTS ======= */
import { useAuth } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';

/** ======= MUI COMPONENTS ======= */
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';


/** ======= MUI ICONS ======= */
import { SaveIcon, EditIcon, DeleteIcon, LazyIcon, CloseIcon } from '../components/LazyIcons';

/** ======= PROJECT FILES ======= */
import { DASHBOARD, VIEW_PROJECT } from '../data/Routes';
import { capitalize, getChipColor, getLifecycleColor, getPriorityColor } from '../data/Functions';
import { deleteTask, TaskWrapper } from '../data/Tasks';
import LoadingPage from './LoadingPage';
import NotFoundPage from './NotFoundPage';
import LayoutContainer from '../components/LayoutContainer';
import PageTitle from '../components/PageTitle';
import type { ProjectWrapper } from '../data/Project';
import type { ColumnType, LifecycleType, TaskPriority, TaskType } from '../data/Types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../data/Firebase';
import { CardActions } from '@mui/material';

/** ======= FUTURE FEATURES ======= */
// import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';

const lifecycles = ['alpha', 'beta', 'stable'] as const;
const types = ['feature', 'bug'] as const;
const priorities = ['high', 'medium', 'low'] as const;

/** @description A page for the individual task */
const ViewTask = () => {
    const { user, userData } = useAuth();
    const { id, taskId } = useParams();
    const { setFeedback } = useFeedback();
    const [project, setProject] = useState<ProjectWrapper | null>(null);
    const [task, setTask] = useState<TaskWrapper | null>();
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const navigateToDashboard = () => navigate(DASHBOARD);
    useEffect(() => {
        if (user && userData) {
            if (id) {
                const proj = userData.findProject(id);
                if (proj) {
                    setProject(proj);
                    if (taskId) {
                        const t = proj.findTask(taskId);
                        if (t) {
                            setTask(new TaskWrapper(t.toFirestore()));
                            setLoading(false);
                        } else {
                            setLoading(false);
                            setFeedback('Task not found!', 'error');
                            navigateToDashboard();
                        }
                    }
                } else {
                    setLoading(false);
                    setFeedback('Project not found!', 'error');
                    navigateToDashboard();
                }
            }
        }
    }, []);
    if (!taskId) return;
    if (!id) return;
    const handleSave = async () => {
        const oldTask = project?.findTask(taskId);
        if (oldTask && task && user) {
            const equal = oldTask.isEqual(task);
            if (equal) {
                setEditMode(false);
                setFeedback('No changes made!', 'info');
                return;
            }
            try {
                const taskRef = doc(db, 'users', user.uid, 'projects', id, 'tasks', taskId);
                await updateDoc(taskRef, task.toFirestore());

                setEditMode(false);
                setFeedback('Task updated!', 'success');
                return;
            } catch (error) {
                console.error('Failed to update task:', error);
                setFeedback('Failed to update task', 'error');
            }
        };
    };
    const handleDelete = async () => {
        if (user) {
            if (!user.uid || !id || !taskId) {
                setFeedback('Missing required information.', 'error');
                return;
            }
            const response = await deleteTask(user.uid, id, taskId);
            setFeedback(response.message, response.success ? 'success' : 'error');
            if (response.success) {
                setEditMode(false);
                setOpenDialog(false);
                navigate(VIEW_PROJECT(id));
            }
        }
    };
    if (loading) return <LoadingPage />;
    if (!project) return <NotFoundPage />;
    if (!task) return <NotFoundPage />;
    return (
        <LayoutContainer backIcon to={VIEW_PROJECT(id)}>
            <PageTitle title={`${editMode ? 'Editing' : 'Viewing'} Task`} divider />
            <Dialog open={openDialog}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={DeleteIcon} color='error' sx={{ mr: 1 }} />Delete Journal</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} >Close</Button>
                    <Button variant='contained' onClick={handleDelete} color='error'>Delete</Button>
                </DialogActions>
            </Dialog>
            {editMode && (
                <Card sx={{ p: 2 }}>
                    <CardContent>
                        <TextField
                            label="Title"
                            fullWidth
                            margin="normal"
                            value={task.title}
                            onChange={(e) => {
                                setTask((prev) => {
                                    if (prev) {
                                        return new TaskWrapper(({ ...prev, createdAt: prev.createdAt.toISOString(), dueDate: prev.dueDate ? prev.dueDate.toISOString() : null, lastUpdated: new Date().toISOString(), title: e.target.value }));
                                    } else {
                                        return prev;
                                    }
                                });
                            }}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            margin="normal"
                            value={task.description}
                            onChange={(e) => {
                                setTask((prev) => {
                                    if (prev) {
                                        return new TaskWrapper(({ ...prev, createdAt: prev.createdAt.toISOString(), dueDate: prev.dueDate ? prev.dueDate.toISOString() : null, lastUpdated: new Date().toISOString(), description: e.target.value }));
                                    } else {
                                        return prev;
                                    }
                                });
                            }}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Column</InputLabel>
                            <Select value={task.column ? task.column : ''} label="Column" onChange={(e) => {
                                setTask((prev) => {
                                    if (prev) {
                                        return new TaskWrapper(({ ...prev, createdAt: prev.createdAt.toISOString(), dueDate: prev.dueDate ? prev.dueDate.toISOString() : null, lastUpdated: new Date().toISOString(), column: (e.target.value as ColumnType) }));
                                    } else {
                                        return prev;
                                    }
                                });
                            }}>
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
                            <Select value={task.lifecycle ? task.lifecycle : ''} label="Lifecycle" onChange={(e) => {
                                setTask((prev) => {
                                    if (prev) {
                                        return new TaskWrapper(({ ...prev, createdAt: prev.createdAt.toISOString(), dueDate: prev.dueDate ? prev.dueDate.toISOString() : null, lastUpdated: new Date().toISOString(), lifecycle: (e.target.value as LifecycleType) }));
                                    } else {
                                        return prev;
                                    }
                                });
                            }}>
                                {lifecycles.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Type</InputLabel>
                            <Select value={task.type ? task.type : ''} label="Type" onChange={(e) => {
                                setTask((prev) => {
                                    if (prev) {
                                        return new TaskWrapper(({ ...prev, createdAt: prev.createdAt.toISOString(), dueDate: prev.dueDate ? prev.dueDate.toISOString() : null, lastUpdated: new Date().toISOString(), type: (e.target.value as TaskType) }));
                                    } else {
                                        return prev;
                                    }
                                });
                            }}>
                                {types.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Priority</InputLabel>
                            <Select value={task.priority ? task.priority : ''} label="Priority" onChange={(e) => {
                                setTask((prev) => {
                                    if (prev) {
                                        return new TaskWrapper(({ ...prev, createdAt: prev.createdAt.toISOString(), dueDate: prev.dueDate ? prev.dueDate.toISOString() : null, lastUpdated: new Date().toISOString(), priority: (e.target.value as TaskPriority) }));
                                    } else {
                                        return prev;
                                    }
                                });
                            }}>
                                {priorities.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </CardContent>
                    <CardActions>
                        <Button startIcon={<LazyIcon icon={CloseIcon} />} onClick={() => setEditMode(false)}>Cancel</Button>
                        <Button startIcon={<LazyIcon icon={DeleteIcon} />} color='error' onClick={() => setOpenDialog(true)}>Delete</Button>
                    </CardActions>
                </Card>
            )}
            {!editMode && (
                <Card>
                    <CardHeader
                        title={<><Typography variant='inherit'>{task.title}</Typography></>}
                        subheader={<><Typography variant='inherit' >{task.description}</Typography><Divider sx={{ my: 2 }} /></>}
                    />
                    <CardContent>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {task && task.column != null && (<Chip color='primary' label={`Column: ${capitalize(task?.column)}`} variant="outlined" />)}
                            {task && task.priority != null && (<Chip color={getPriorityColor(task.priority)} label={`Priority: ${capitalize(task?.priority)}`} />)}
                            {task && task.type != null && (<Chip color={getChipColor(task.type)} label={`Type: ${capitalize(task?.type)}`} />)}
                            {task && task.lifecycle != null && (<Chip color={getLifecycleColor(task.lifecycle)} label={`Lifecycle: ${capitalize(task?.lifecycle)}`} variant="outlined" />)}
                            {task?.assignees.map((a) => (
                                <Chip key={a} label={a} color="default" />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}
            <Fab
                color={editMode ? 'success' : 'primary'}
                onClick={editMode ? handleSave : () => setEditMode(true)}
                sx={{
                    position: 'fixed',
                    bottom: 110,
                    right: 32,
                    zIndex: 100
                }}
            >
                {editMode ? <LazyIcon icon={SaveIcon} /> : <LazyIcon icon={EditIcon} />}
            </Fab>
        </LayoutContainer>
    );
};
export default ViewTask;