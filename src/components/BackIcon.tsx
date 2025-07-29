import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon, LazyIcon } from './LazyIcons';

const BackIcon = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ mb: 2 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="Go back">
                <LazyIcon icon={ArrowBackIcon} />
            </IconButton>
        </Box>
    );
};

export default BackIcon;