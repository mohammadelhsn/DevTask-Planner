/** ======= MUI COMPONENTS ======= */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

/** ======= TYPES ======= */
import type { FeatureCardProps } from '../data/Types';

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${index}-${feature.title}`}>
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
    );
};

export default FeatureCard;