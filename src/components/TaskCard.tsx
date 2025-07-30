/** ======= MUI COMPONENTS ======= */
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

/** ======= REACT ROUTER ======= */
import { useNavigate } from 'react-router-dom';

/** ======= PROJECT FILES ======= */
import { capitalize, getChipColor, getLifecycleColor, getPriorityColor } from '../data/Functions';
import { chipStyles } from '../data/Styles';
import { VIEW_TASK } from '../data/Routes';
import type { TaskCardProps } from '../data/Types';
import { LazyIcon } from './LazyIcons';
import { priorityIcons, typeIcons, lifecycleIcons } from '../data/Constants';

/** @description Task Card for Project Page */
const TaskCard = ({ t, projectId }: TaskCardProps) => {
    const navigate = useNavigate();
    const navigateToTask = (projectId: string, taskId: string) => navigate(VIEW_TASK(projectId, taskId));
    return (
        <Card elevation={5}>
            <CardHeader title={
                <>
                    <Typography variant='subtitle1'>{t.title}</Typography>
                    <Divider sx={{ mt: 1 }} />
                </>}
                subheader={
                    <>
                        {t.type != null && (<Chip color={getChipColor(t.type)} label={capitalize(t.type)} sx={chipStyles} icon={<LazyIcon icon={typeIcons[t.type]} />}></Chip>)}
                        {t.lifecycle != null && (<Chip variant='outlined' color={getLifecycleColor(t.lifecycle)} label={capitalize(t.lifecycle)} icon={<LazyIcon icon={lifecycleIcons[t.lifecycle]} />} sx={chipStyles}></Chip>)}
                        {t.priority != null && (<Chip
                            variant="filled"
                            color={getPriorityColor(t.priority)}
                            label={capitalize(t.priority) + ' Priority'}
                            icon={<LazyIcon icon={priorityIcons[t.priority]} color='inherit' />}
                            sx={chipStyles}
                        />)}
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