import Container from '@mui/material/Container';
import type { ReactNode } from 'react';
import { containerStyles } from '../data/Styles';
import BackIcon from './BackIcon';

const LayoutContainer = ({ children, backIcon, to }: { children: ReactNode, backIcon?: boolean; to?: string; }) => {
    return (
        <Container maxWidth='xl' sx={containerStyles}>
            {backIcon && (<BackIcon TO={to} />)}
            {children}
        </Container>
    );
};

export default LayoutContainer;