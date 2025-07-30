import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon, LazyIcon } from './LazyIcons';

const BackIcon = ({ TO }: { TO?: string; }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (typeof TO === 'string') {
            navigate(TO);
        } else {
            navigate(-1);
        }
    };
    return (
        <Box sx={{ mb: 2 }}>
            <IconButton onClick={handleClick} aria-label="Go back">
                <LazyIcon icon={ArrowBackIcon} />
            </IconButton>
        </Box>
    );
};

export default BackIcon;