/** ======= MUI COMPONENTS ======= */

import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

/** ======= STYLES =======  */
import { divCenter } from '../data/Styles';

/**   The loading page for the project */
const LoadingPage = () => {
    return (
        <Box
            sx={{
                height: '100vh',
                ...divCenter,
                backgroundColor: 'background.default',
                p: 2,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    ...divCenter,
                    minWidth: 200,
                    minHeight: 200,
                }}
            >
                <CircularProgress />
            </Paper>
        </Box>
    );
};

export default LoadingPage;