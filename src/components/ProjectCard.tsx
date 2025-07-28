/** ======= MUI COMPONENTS ======= */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

/** ======= REACT ROUTER ======= */
import { useNavigate } from 'react-router-dom';

/** ======= PROJECT FILES ======= */
import { cardStyles } from '../data/Styles';
import { VIEW_PROJECT } from '../data/Routes';
import type { ProjectCardProps } from '../data/Types';

/** @description Project Card for Dashboard Page */
const ProjectCard = ({ proj, index }: ProjectCardProps) => {
    const navigate = useNavigate();
    const navigateToViewProject = (id: string) => navigate(VIEW_PROJECT(id));
    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${index}-${proj.id}`}>
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
                <CardActions sx={{ pl: 1 }}>
                    <Button
                        onClick={() => navigateToViewProject(proj.id)}
                        variant='text'
                        sx={{
                            transition: '0.3s ease',
                            '&:hover': {
                                bgcolor: ({ palette }) => palette.primary.main,
                                color: ({ palette }) => palette.text.primary,
                            }
                        }}>
                        View Entry
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};
export default ProjectCard;