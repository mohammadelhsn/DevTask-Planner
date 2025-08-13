/** ======= MUI COMPONENTS ======= */
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

/** ======= CUSTOM LAZY ICONS ======= */
import { LazyIcon } from './LazyIcons';

/** ======= STYLES ======= */
import { dividerStyle } from '../data/Styles';

/** ======= TYPES ======= */
import type { LazyIconType } from '../data/Types';


const PageTitle = ({ title, desc, divider, icon }: { title: string, desc?: string, divider?: boolean, icon?: LazyIconType; }) => {
    return (
        <Box mt={2}>
            {icon ? <Typography variant='h2' sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon fontSize='inherit' icon={icon} color="primary" sx={{ mr: 1 }} /> {title}</Typography> : <Typography variant='h2'>{title}</Typography>}
            {desc && (<Typography variant='h5' sx={{ fontStyle: 'italic' }}>{desc}</Typography>)}
            {divider && <Divider sx={dividerStyle} />}
        </Box>
    );
};

export default PageTitle;