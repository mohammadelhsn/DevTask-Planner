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
import CardActions from '@mui/material/CardActions';
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
import Fade from '@mui/material/Fade';

/** ======= Custom Components ======= */
import PageTitle from '../components/PageTitle';
import LayoutContainer from '../components/LayoutContainer';
import TaskChip from '../components/TaskChip';
import DeleteDialog from '../components/DeleteDialog';

/** ======= Pages ======= */
import LoadingPage from './LoadingPage';
import NotFoundPage from './NotFoundPage';


/** ======= MUI ICONS ======= */
import { SaveIcon, EditIcon, DeleteIcon, LazyIcon, CloseIcon } from '../components/LazyIcons';

/** ======= Data, Types, Constants && Functions ======= */
import { lifecycles, types, priorities, typeIcons, lifecycleIcons, priorityIcons, categoryIcons } from '../data/Constants';
import { DASHBOARD, VIEW_PROJECT } from '../data/Routes';
import { capitalize, getChipColor, getLifecycleColor, getPriorityColor } from '../data/Functions';
import { deleteTask, TaskWrapper, } from '../data/Tasks';
import type { ProjectWrapper } from '../data/Project';
import type { ColumnType, LifecycleType, TaskObject, TaskPriority, TaskType, } from '../data/Types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../data/Firebase';




/** ======= FUTURE FEATURES ======= */
// import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';

/** @description A page for the individual task */
const ViewTask = () => {
    const { user, userData } = useAuth();
    const { id, taskId } = useParams();
    const { setFeedback } = useFeedback();
    const [project, setProject] = useState<ProjectWrapper | null>(null);
    const [task, setTask] = useState<TaskWrapper | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();
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
                            setLoaded(true);
                        } else {
                            setLoading(false);
                            setFeedback('Task not found!', 'error');
                            navigate(DASHBOARD);
                        }
                    }
                } else {
                    setLoading(false);
                    setFeedback('Project not found!', 'error');
                    navigate(DASHBOARD);
                }
            }
        }
    }, [user, userData, id, taskId, navigate, setFeedback]);
    if (!taskId || !id) return null;
    const updateTaskField = (field: Partial<TaskObject>) => {
        setTask(prev => {
            if (!prev) return prev;
            return new TaskWrapper({
                ...prev,
                createdAt: prev.createdAt.toISOString(),
                dueDate: prev.dueDate ? prev.dueDate.toISOString() : null,
                lastUpdated: new Date().toISOString(),
                ...field,
            });
        });
    };
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
    const handleCancel = () => {
        const oldTask = project?.findTask(taskId);
        setEditMode(false);
        if (oldTask) {
            setTask(oldTask);
        }
    };
    if (loading) return <LoadingPage />;
    if (!project || !task) return <NotFoundPage />;
    return (
        <Fade in={loaded} timeout={500}>
            <div>
                <LayoutContainer backIcon to={VIEW_PROJECT(id)}>
                    <PageTitle title={`${editMode ? 'Editing' : 'Viewing'} Task`} divider />
                    <DeleteDialog openDialog={openDialog} setOpenDialog={setOpenDialog} handleDelete={handleDelete} />
                    {editMode && (
                        <Card sx={{ p: 2 }}>
                            <CardContent>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    margin="normal"
                                    value={task.title}
                                    onChange={(e) => updateTaskField({ title: e.target.value })}
                                />
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    margin="normal"
                                    value={task.description}
                                    onChange={(e) => updateTaskField({ description: e.target.value })}
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Column</InputLabel>
                                    <Select value={task.column ? task.column : ''} label="Column" onChange={(e) => updateTaskField({ column: e.target.value })} renderValue={(selected) => (
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
                                    <Select value={task.lifecycle ? task.lifecycle : ''} label="Lifecycle" onChange={(e) => updateTaskField({ lifecycle: e.target.value })} renderValue={(selected) => (
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
                                    <Select value={task.type ? task.type : ''} label="Type" onChange={(e) => updateTaskField({ type: e.target.value })} renderValue={(selected) => (
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
                                    <Select value={task.priority ? task.priority : ''} label="Priority" onChange={(e) => updateTaskField({ priority: e.target.value })} renderValue={(selected) => (
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
                            </CardContent>
                            <CardActions>
                                <Button startIcon={<LazyIcon icon={CloseIcon} />} onClick={handleCancel}>Cancel</Button>
                                <Button startIcon={<LazyIcon icon={DeleteIcon} />} color='error' onClick={() => setOpenDialog(true)}>Delete</Button>
                            </CardActions>
                        </Card>
                    )}
                    {!editMode && (
                        <Card>
                            <CardHeader
                                title={<><Typography variant='inherit'>{task.title}</Typography></>}
                                subheader={<><Typography variant='inherit' sx={{ mt: 2, whiteSpace: 'pre-line' }}>{task.description}</Typography><Divider sx={{ my: 2 }} /></>}
                            />
                            <CardContent>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {task.column != null && (<TaskChip type='column' value={task.column} />)}
                                    {task.type != null &&
                                        (<TaskChip type='type' value={task.type} />)}
                                    {task.lifecycle != null &&
                                        (<TaskChip type={'lifecycle'} value={task.lifecycle} />)}
                                    {task.priority != null &&
                                        (<TaskChip type={'priority'} value={task.priority} />)}
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
            </div>
        </Fade>
    );
};
export default ViewTask;