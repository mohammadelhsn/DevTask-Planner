import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
} from '@mui/material';

const features = [
    {
        title: 'Task Management',
        description: 'Organize your tasks with tags, priorities, and deadlines.',
    },
    {
        title: 'Kanban Board',
        description: 'Visualize progress with columns.',
    },
    // {
    //     title: 'Dev Focused',
    //     description: 'Built with developers in mind. Clean. Fast. Logical.',
    // },
    {
        title: 'Team Collaboration',
        description: 'Assign tasks and keep everyone on the same page.',
    },
    {
        title: 'Dark Mode',
        description: 'Because we know light mode burns your eyes.',
    },
    // {
    //     title: 'Git Integration',
    //     description: 'Link pull requests and commits directly to tasks.',
    // },
];

export default function HomePage() {
    return (
        <Box>
            {/* Hero Section */}
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
                    <Typography variant="h5" color="text.secondary" paragraph>
                        Your developer-first task planner. Simple. Powerful. Focused.
                    </Typography>
                    <Button variant="contained" size="large">
                        Get Started
                    </Button>
                </Container>
            </Box>

            {/* Features Section */}
            <Container sx={{ py: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Features
                </Typography>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    {features.map((feature, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Call to Action */}
            <Box
                sx={{
                    py: 8,
                    backgroundColor: 'background.default',
                    color: 'primary.contrastText',
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
    );
}
