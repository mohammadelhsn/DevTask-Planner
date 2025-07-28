import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { divCenter } from '../data/Styles';

const LoadingPlaceholder = () => (
    <Box
        sx={{
            ...divCenter,
            height: '100vh'
        }}
    >
        <CircularProgress />
    </Box>
);


export default LoadingPlaceholder;