/** ======= MUI COMPONENTS ======= */

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/** @description The Footer component for the project */
const Footer = () => {
    return (
        <Box component="footer" textAlign="center" py={4} sx={{
            boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)',
            bgcolor: (theme) => theme.palette.background.default,
            color: (theme) => theme.palette.text.secondary
        }}>
            <Typography variant="body2" mt={3} color="text.secondary">
                © 2025 Mohammad El-Hassan. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;