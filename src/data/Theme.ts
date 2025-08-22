import { createTheme } from '@mui/material';

/**   Primary Color */
const primary = '#6093EA';

/**   Secondary Color */
const secondary = '#9C27B0';

/**   Light Theme */
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

/**   Dark Theme */
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
