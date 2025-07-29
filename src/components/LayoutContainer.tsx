import Container from '@mui/material/Container';
import type { ReactNode } from 'react';
import { containerStyles } from '../data/Styles';
import BackIcon from './BackIcon';

const LayoutContainer = ({ children, backIcon }: { children: ReactNode, backIcon?: boolean; }) => {
    return (
        <Container maxWidth='xl' sx={containerStyles}>
            {backIcon && (<BackIcon />)}
            {children}
        </Container>
    );
};

export default LayoutContainer;