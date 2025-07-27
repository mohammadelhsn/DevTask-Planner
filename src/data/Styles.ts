import type { SxProps, Theme } from '@mui/material';

export type Style = SxProps<Theme>;

export const containerStyles: Style = {
	px: { xs: 2, sm: 3 },
	py: { xs: 4, sm: 6 },
	flexGrow: 1,
};

export const divCenter: Style = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

export const combinedStyles = {
	...containerStyles,
	...divCenter,
} as Style;

export const dividerStyle: Style = {
	my: 2,
};

export const providerButton: Style = {
	...divCenter,
	transition: '0.3s ease',
	'&:hover': {
		transform: 'scale(1.02)',
		bgcolor: ({ palette }) => palette.primary.light,
		color: ({ palette }) => palette.text.primary,
	},
};

export const cardStyles: Style = {
	transition: '0.3s ease',
	'&:hover': {
		transform: 'scale(1.03)',
	},
};
