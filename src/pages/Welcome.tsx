/** ======= MUI COMPONENTS ======= */

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { combinedStyles } from '../data/Styles';

/** ======= WELCOME PAGE ======= */

const Welcome = () => {
    return (
        <Container
            maxWidth="lg"
            sx={combinedStyles}
        >
            <Typography variant='h1'>Welcome to DevTask Planner</Typography>
        </Container>
    );
};

export default Welcome;