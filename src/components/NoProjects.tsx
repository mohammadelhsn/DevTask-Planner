/** ======= MUI COMPONENTS ======= */
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

/** ======= LOCAL STYLES ======= */
import { divCenter } from '../data/Styles';

/** ======= LOCAL COMPONENTS ======= */
import { FolderOffIcon, LazyIcon } from './LazyIcons';

/** Component when no project is found */
const NoProjectsMessage = () => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                mt: 4,
                textAlign: 'center',
                flexDirection: 'column',
                ...divCenter
            }}
        >
            <LazyIcon icon={FolderOffIcon} fontSize='large' color='primary' sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>No projects created yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Start your first project to begin organizing your tasks.
            </Typography>
        </Paper>
    );
};

export default NoProjectsMessage;