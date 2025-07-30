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
import Fade from '@mui/material/Fade';


/** ======= MUI ICONS ======= */
import { SaveIcon, EditIcon, DeleteIcon, LazyIcon, CloseIcon } from '../components/LazyIcons';

/** ======= PROJECT FILES ======= */
import { DASHBOARD, VIEW_PROJECT } from '../data/Routes';
import { capitalize, getChipColor, getLifecycleColor, getPriorityColor } from '../data/Functions';
import { deleteTask, TaskWrapper, } from '../data/Tasks';
import LoadingPage from './LoadingPage';
import NotFoundPage from './NotFoundPage';
import LayoutContainer from '../components/LayoutContainer';
import PageTitle from '../components/PageTitle';
import type { ProjectWrapper } from '../data/Project';
import type { TaskObject, } from '../data/Types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../data/Firebase';
import { CardActions } from '@mui/material';
import DeleteDialog from '../components/DeleteDialog';
import { lifecycles, types, priorities } from '../data/Constants';

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
                                    <Select value={task.column ? task.column : ''} label="Column" onChange={(e) => updateTaskField({ column: e.target.value })}>
                                        {project.config.map((option, index) => (
                                            option.enabled && (
                                                <MenuItem key={`${option.id}-${index}-newTask`} value={option.id}>
                                                    {capitalize(option.label)}
                                                </MenuItem>
                                            )
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Lifecycle</InputLabel>
                                    <Select value={task.lifecycle ? task.lifecycle : ''} label="Lifecycle" onChange={(e) => updateTaskField({ lifecycle: e.target.value })}>
                                        {lifecycles.map(option => (
                                            <MenuItem key={option} value={option}>{capitalize(option)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Type</InputLabel>
                                    <Select value={task.type ? task.type : ''} label="Type" onChange={(e) => updateTaskField({ type: e.target.value })}>
                                        {types.map(option => (
                                            <MenuItem key={option} value={option}>{capitalize(option)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Priority</InputLabel>
                                    <Select value={task.priority ? task.priority : ''} label="Priority" onChange={(e) => updateTaskField({ priority: e.target.value })}>
                                        {priorities.map(option => (
                                            <MenuItem key={option} value={option}>{capitalize(option)}</MenuItem>
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
            </div>
        </Fade>
    );
};
export default ViewTask;