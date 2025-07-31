/** ======= MUI COMPONENTS ======= */
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

/** ======= REACT ROUTER ======= */
import { useNavigate } from 'react-router-dom';

/** ======= PROJECT FILES ======= */
import { VIEW_TASK } from '../data/Routes';
import type { TaskCardProps } from '../data/Types';
import { LazyIcon, TaskIcon } from './LazyIcons';
import TaskChip from './TaskChip';

/** @description Task Card for Project Page */
const TaskCard = ({ t, projectId }: TaskCardProps) => {
    const navigate = useNavigate();
    const navigateToTask = (projectId: string, taskId: string) => navigate(VIEW_TASK(projectId, taskId));
    return (
        <Card elevation={5}>
            <CardHeader title={
                <>
                    <Typography variant='subtitle1' sx={{ display: 'flex', alignItems: 'center' }}>{<LazyIcon icon={TaskIcon} color='primary' sx={{ mr: 1 }} />}{t.title}</Typography>
                    <Divider sx={{ mt: 1 }} />
                </>}
                subheader={
                    <>
                        {t.type != null &&
                            (<TaskChip type='type' value={t.type} />)}
                        {t.lifecycle != null &&
                            (<TaskChip type={'lifecycle'} value={t.lifecycle} />)}
                        {t.priority != null &&
                            (<TaskChip type={'priority'} value={t.priority} />)}
                    </>}
            />
            <CardContent sx={{ pt: 0 }}><Typography>{t.description}</Typography></CardContent>
            <CardActions>
                <Button onClick={() => navigateToTask(projectId, t.id)} sx={{
                    transition: '0.3s ease',
                    '&:hover': {
                        bgcolor: ({ palette }) => palette.primary.main,
                        color: ({ palette }) => palette.text.primary,
                    }
                }}>
                    View Task
                </Button>
            </CardActions>
        </Card>
    );
};
export default TaskCard;