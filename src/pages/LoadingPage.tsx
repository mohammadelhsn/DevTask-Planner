/** ======= REACT ======= */
import { useEffect, useState } from 'react';

/** ======= MUI COMPONENTS ======= */

import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

/** ======= STYLES =======  */
import { divCenter } from '../data/Styles';

/** @description The loading page for the project */
const LoadingPage = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => setLoaded(true), []);
    return (
        <Fade in={loaded} timeout={500}>
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
        </Fade>
    );
};

export default LoadingPage;