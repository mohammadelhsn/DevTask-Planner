/** ======= MUI COMPONENTS ======= */

import Typography from '@mui/material/Typography';

/**  */
import LayoutContainer from '../components/LayoutContainer';

/** */
import { combinedStyles } from '../data/Styles';



/** ======= WELCOME PAGE ======= */

const Welcome = () => {
    return (
        <LayoutContainer>
            <Typography variant='h1' sx={combinedStyles}>Welcome to DevTask-Planner</Typography>
        </LayoutContainer>
    );
};

export default Welcome;