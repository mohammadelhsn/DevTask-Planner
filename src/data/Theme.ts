import { createTheme } from '@mui/material';

/** @description Primary Color */
const primary = '#6093EA';

/** @description Secondary Color */
const secondary = '#9C27B0';

/** @description Light Theme */
export const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: primary,
		},
		secondary: {
			main: secondary,
		},
	},
});

/** @description Dark Theme */
export const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: primary,
		},
		secondary: {
			main: secondary,
		},
	},
});
