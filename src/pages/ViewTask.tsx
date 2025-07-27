import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const ViewTask = () => {
    const { projectId, taskId } = useParams();
    console.log(projectId, taskId);
    return (
        <Typography variant='h2'>View Task</Typography>
    );
};
export default ViewTask;