/** ======= React ======= */
import { useEffect, useState } from 'react';

/** ======= Mui Components ======= */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';

/** ======= Custom Components ======= */
import FeatureCard from '../components/FeatureCard';

/** ======= Data & Types ======= */
import { features } from '../data/Constants';

const HomePage = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setLoaded(true), 100); // Delay is optional
        return () => clearTimeout(timeout);
    }, []);
    return (
        <Fade in={loaded} timeout={500}>
            <Box>
                <Box
                    sx={{
                        py: 10,
                        px: 2,
                        backgroundColor: 'background.default',
                        textAlign: 'center',
                    }}
                >
                    <Container maxWidth="md">
                        <Typography variant="h2" gutterBottom>
                            DevTask
                        </Typography>
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                            Your developer-first task planner. Simple. Powerful. Focused.
                        </Typography>
                        <Button variant="contained" size="large">
                            Get Started
                        </Button>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }}>
                    <Divider><Typography variant="h4" align="center" gutterBottom>Features</Typography></Divider>
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        {features.map((feature, index) => (<FeatureCard feature={feature} index={index} />))}
                    </Grid>
                </Container>
                <Box
                    sx={{
                        py: 8,
                        backgroundColor: 'background.default',
                        color: 'text.primary',
                        textAlign: 'center',
                    }}
                >
                    <Container>
                        <Typography variant="h4" gutterBottom>
                            Ready to take control of your workflow?
                        </Typography>
                        <Button variant="contained" color="primary" size="large">
                            Create an Account
                        </Button>
                    </Container>
                </Box>
            </Box>
        </Fade>

    );
};


export default HomePage;