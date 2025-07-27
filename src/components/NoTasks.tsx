/** ======= MUI COMPONENTS ======= */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/** ======= LOCAL COMPONENTS ======= */
import { InboxIcon, LazyIcon } from './LazyIcons';

const NoTasks = ({ message = "No tasks here! Woohoo!" }: { message?: string; }) => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={2} color="text.secondary">
            <LazyIcon icon={InboxIcon} color='primary' sx={{ fontSize: 48, mb: 1 }} ></LazyIcon>
            <Typography variant="body1" align="center">{message}</Typography>
        </Box>
    );
};

export default NoTasks;
