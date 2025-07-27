import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, type SxProps } from '@mui/material';

const cardStyles: SxProps = {
    transition: '0.3s ease',
    '&:hover': {
        transform: 'scale(1.03)'
    }
};


const Dashboard = () => {
    const navigate = useNavigate();
    const { palette } = useTheme();
    const { userData, user, loading } = useAuth();
    useEffect(() => {
        if (!userData && !user) {
            navigate('/login');
        }
    });
    if (loading) return (<Typography variant='inherit'>Loading...</Typography>);
    return (
        <Container sx={{ flexGrow: 1 }}>
            <Box sx={{ mt: 2 }}>
                <Typography variant='h2'>Welcome, {userData?.name}!</Typography>
                <Divider sx={{ my: 2 }} />
            </Box>

            <Paper sx={{ p: 2 }}>
                <Grid container spacing={3}>
                    {user && userData && userData.projects.length > 0 && userData.projects.map((proj, index) => (
                        <Grid size={{ xs: 2, sm: 4, md: 4 }} key={`${index}-${proj.id}`}>
                            <Card elevation={3} sx={cardStyles}>
                                <CardHeader
                                    title={
                                        <>
                                            <Box>{proj.projectName}</Box>
                                            <Divider sx={{ mt: 1 }} />
                                        </>
                                    }
                                />
                                <CardContent>
                                    <Typography>
                                        {proj.projectDesc.trim().length > 0
                                            ? proj.projectDesc
                                            : 'There is no content yet! Edit me!'}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ paddingLeft: 1 }}>
                                    <Button onClick={() => {
                                        navigate(`/project/${proj.id}`);
                                    }} variant='text' sx={{
                                        transition: '0.3s ease', '&:hover': {
                                            bgcolor: palette.primary.main,
                                            color: palette.text.primary,
                                        }
                                    }}>
                                        View Entry
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
            <Box sx={{
                position: 'fixed',
                bottom: 120,
                right: 24,
                zIndex: 1000,
            }}>
                <Fab color="primary" aria-label="add" onClick={() => navigate('/project/new')}
                    sx={{
                        '&:hover .spin-icon': {
                            transform: 'rotate(180deg) scale(1.2)',
                            transition: 'transform 0.3s ease',
                        },
                        transition: '0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.2)'
                        }
                    }}
                >
                    <AddIcon className="spin-icon" sx={{
                        transition: 'transform 0.8s ease',
                        transformOrigin: 'center',
                    }} />
                </Fab>
            </Box>

        </Container>
    );
};

export default Dashboard;