export function capitalize(str: string) {
	if (typeof str !== 'string' || str.length === 0) {
		return ''; // Handle empty or non-string inputs
	}
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const getChipColor = (type: 'feature' | 'bug') => {
	if (type == 'feature') {
		return 'primary';
	} else {
		return 'error';
	}
};
export const getLifecycleColor = (stage: 'alpha' | 'beta' | 'stable') => {
	if (stage == 'alpha') {
		return 'warning';
	} else if (stage == 'beta') {
		return 'info';
	} else {
		return 'success';
	}
};
export function getPriorityColor(
	priority: string
): 'error' | 'warning' | 'success' {
	switch (priority.toLowerCase()) {
		case 'high':
			return 'error';
		case 'medium':
			return 'warning';
		case 'low':
		default:
			return 'success';
	}
}
