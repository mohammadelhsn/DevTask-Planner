/** MUI COMPONENTS */

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

/** WELCOME PAGE */

const Welcome = () => {
    return (
        <Container
            maxWidth="lg"
            sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 4, sm: 6 },
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Typography variant='h1'>Welcome to DevTask Planner</Typography>
        </Container>
    );
};

export default Welcome;