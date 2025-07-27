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
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';

/** ======= MUI ICONS ======= */
import { SaveIcon, EditIcon, LazyIcon } from '../components/LazyIcons';

/** ======= PROJECT FILES ======= */
import { DASHBOARD } from '../data/Routes';
import { capitalize, getChipColor, getLifecycleColor, getPriorityColor } from '../data/Functions';
import { containerStyles, dividerStyle } from '../data/Styles';
import type { TaskWrapper } from '../data/Tasks';

/** ======= FUTURE FEATURES ======= */
// import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';

/** @description A page for the individual task */
const ViewTask = () => {
    const { user, userData } = useAuth();
    const { id, taskId } = useParams();
    const { setFeedback } = useFeedback();
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const navigateToDashboard = () => navigate(DASHBOARD);
    const [task, setTask] = useState<TaskWrapper | null>(null);
    useEffect(() => {
        if (user && userData) {
            if (id) {
                const proj = userData.findProject(id);
                if (proj) {
                    if (taskId) {
                        const t = proj.findTask(taskId);
                        if (t) {
                            setTask(t);
                        } else {
                            setFeedback('Task not found!', 'error');
                            navigateToDashboard();
                            return;
                        }
                    }
                } else {
                    setFeedback('Project not found!', 'error');
                    navigateToDashboard();
                    return;
                }
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
                    <CardHeader
                        title={<><Typography variant='inherit'>{task?.title}</Typography></>}
                        subheader={<><Typography variant='inherit' >{task?.description}</Typography></>}
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
                    bottom: 32,
                    right: 32,
                    zIndex: 1000
                }}
            >
                {editMode ? <LazyIcon icon={SaveIcon} /> : <LazyIcon icon={EditIcon} />}
            </Fab>
        </Container>

    );
};
export default ViewTask;