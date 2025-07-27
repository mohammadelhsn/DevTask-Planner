import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
//import CardHeader from '@mui/material/CardHeader';
//import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import type { TaskWrapper } from '../data/Tasks';
import { useFeedback } from '../contexts/FeedbackContext';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
//import Collapse from '@mui/material/Collapse';
import { capitalize, getChipColor, getLifecycleColor, getPriorityColor } from '../data/Functions';
import { containerStyles, dividerStyle } from '../data/Styles';


const ViewTask = () => {
    const { user, userData } = useAuth();
    const { id, taskId } = useParams();
    const { setFeedback } = useFeedback();
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const [task, setTask] = useState<TaskWrapper | null>(null);
    useEffect(() => {
        if (!user || !userData) {
            navigate('/login');
        } else {
            const proj = userData.projects.find((p) => p.id == id);
            if (proj) {
                const t = proj.tasks.find((ta) => ta.id == taskId);
                if (t) {
                    setTask(t);
                } else {
                    setFeedback('Task not found!', 'error');
                    navigate('/dashboard');
                    return;
                }
            } else {
                setFeedback('Project not found!', 'error');
                navigate('/dashboard');
                return;
            }
        }
    }, []);
    const handleSave = () => {
        setEditMode(false);
        setFeedback('Task updated!', 'success');
    };
    return (
        <Container maxWidth="lg" sx={containerStyles}>
            <Box>
                <Typography variant='h2'>View Task</Typography>
                <Divider sx={dividerStyle} />
            </Box>
            {!editMode && (
                <Card>
                    <CardContent>
                        <Typography variant='h5' gutterBottom>{task?.title}</Typography>
                        <Typography variant='body2' sx={{ mb: 2 }}>{task?.description}</Typography>

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
                    bottom: 32,
                    right: 32,
                    zIndex: 1000
                }}
            >
                {editMode ? <SaveIcon /> : <EditIcon />}
            </Fab>
        </Container>

    );
};
export default ViewTask;