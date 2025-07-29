/** ======= REACT ======= */
import { useContext, useState, type MouseEvent } from 'react';

/** ======= REACT ROUTER ======= */
import { NavLink, useNavigate } from 'react-router-dom';

/** ======= CONTEXT ======= */
import { AuthContext } from '../contexts/AuthContext';

/** ======= FIREBASE ======= */
import { signOutUser } from '../data/Firebase';

/** ======= MUI COMPONENTS ======= */
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

/** ======= MUI ICONS ======= */
import LoginIcon from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Settings from '@mui/icons-material/Settings';

/** ======= MUI STYLES ======= */
import { styled, useTheme } from '@mui/material/styles';

/** ======= ROUTES ======= */
import { DASHBOARD, LOGIN, SETTINGS, SIGNUP } from '../data/Routes';


const StyledExternalLink = styled(NavLink)(({ theme }) => ({
    color: 'inherit',
    textDecoration: 'none',
    marginRight: theme.spacing(1),
    fontWeight: 'normal',
    display: 'inline-flex',
    alignItems: 'center',
    '&:hover': {
        textDecoration: 'none',
    },
}));

const Header = () => {
    const { breakpoints } = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const isSmallScreen = useMediaQuery(breakpoints.down('sm'));
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { user } = useContext(AuthContext);
    /** HELPERS */
    const navigateToSettings = () => navigate(SETTINGS);
    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: ({ palette }) => palette.background.default,
                color: ({ palette }) => palette.text.primary,
            }}
        >
            <Toolbar>
                <StyledExternalLink to="/">
                    <Tooltip title="Go Home">
                        <PsychologyIcon />
                    </Tooltip>
                </StyledExternalLink>
                <Divider orientation='vertical' sx={{
                    borderColor: ({ palette }) => palette.text.primary,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    height: 20,    // set height explicitly
                    mr: 1,         // horizontal margin to add space left and right
                }} />
                <StyledExternalLink to={DASHBOARD}>
                    <Tooltip title="View Dashboard">
                        <Button color="inherit" variant="text">
                            Dashboard
                        </Button>
                    </Tooltip>
                </StyledExternalLink>
                <Typography sx={{
                    flexGrow: 1,
                }} />
                {!user &&
                    <Box>
                        <StyledExternalLink to={LOGIN}>
                            {isSmallScreen ?
                                (<IconButton color='inherit'><LoginIcon /></IconButton>)
                                :
                                (<Button color='inherit' variant='contained' startIcon={<LoginIcon fontSize={'small'} />}>
                                    Log In
                                </Button>)}
                        </StyledExternalLink>
                        <StyledExternalLink to={SIGNUP}>
                            {isSmallScreen ? <IconButton color='inherit'><PersonAddIcon /></IconButton> : <Button color='inherit' variant='contained' startIcon={<PersonAddIcon fontSize={'small'} />}>
                                Sign Up
                            </Button>}
                        </StyledExternalLink>
                    </Box>
                }
                {user && (
                    <>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar src={user.photoURL || undefined}>
                                        {!user.photoURL && user.displayName?.[0]}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: ({ palette }) => palette.background.paper,
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {/** 
                             * TODO: THIS DOEST EXIST
                             */}
                            <MenuItem onClick={() => {
                                navigate('/manageAccount');
                            }}>
                                <Avatar src={user.photoURL || undefined}>
                                </Avatar> Manage my Account
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={navigateToSettings}>
                                <ListItemIcon>
                                    <Settings fontSize="small" color='primary' />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem onClick={signOutUser}>
                                <ListItemIcon>
                                    <Logout fontSize="small" color='primary' />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;