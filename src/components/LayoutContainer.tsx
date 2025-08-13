/** ======= MUI COMPONENT ======= */
import Container from '@mui/material/Container';

/** ======= ICONS ======= */
import BackIcon from './BackIcon';

/** ======= STYLES ======= */
import { containerStyles } from '../data/Styles';

/** ======= TYPES ======= */
import type { ReactNode } from 'react';


const LayoutContainer = ({ children, backIcon, to }: { children: ReactNode, backIcon?: boolean; to?: string; }) => {
    return (
        <Container maxWidth='xl' sx={containerStyles}>
            {backIcon && (<BackIcon TO={to} />)}
            {children}
        </Container>
    );
};

export default LayoutContainer;