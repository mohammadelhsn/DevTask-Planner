/** ======= TYPES ======= */
import type { LazyExoticComponent, ReactNode } from 'react';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import type { SvgIconProps, SvgIconTypeMap } from '@mui/material';

import type { ProjectWrapper } from './Project';
import type { TaskWrapper } from './Tasks';
import type { User } from 'firebase/auth';
import type { UserWrapper } from './User';

export type ParentComp = { children: ReactNode };

export type FirestoreRawData<T> = {
	/**   Success state of the operation */
	success: boolean;
	/**   Data */
	data: T | null;
	/**   The error itself (non readable version) */
	error: string | null;
	/**   Response message for the user */
	message: string;
};

export type ColumnConfig = {
	/**   The ID of the Column */
	id: ColumnType;
	/**   Whether the category is enabled */
	enabled: boolean;
	/**   The label for the category */
	label: string;
};

export type DevProjectObject = {
	/**   Project ID */
	id: string;
	/**   The name of the project */
	projectName: string;
	/**   The description of the project */
	projectDesc: string;
	/**   The config for the project */
	config: ColumnConfig[];
	/**   When the project was created */
	createdAt: string;
	/**   When the project was last updated */
	lastUpdated: string;
};

/**   The column the task belongs to */
export type ColumnType =
	| 'Long Term'
	| 'Short Term'
	| 'Medium Term'
	| 'Doing'
	| 'Done'
	| 'Uncategorized';
/**   The lifecycle stage that the task is in */
export type LifecycleType = 'alpha' | 'beta' | 'stable' | null;
/**   The type of task it is  */
export type TaskType = 'feature' | 'bug' | null;
/**   The priority of the task */
export type TaskPriority = 'high' | 'medium' | 'low' | null;

export type TaskObject = {
	/**   The ID of the task */
	id: string;
	/**   The title of the task */
	title: string;
	/**   The description of the task */
	description: string;
	/**   The column the task belongs to */
	column: ColumnType;
	/**   The lifecycle stage that the task is in */
	lifecycle: LifecycleType;
	/**   The type of task it is  */
	type: TaskType;
	/**   The priority of the task */
	priority: TaskPriority;
	/**   The people assigned to the task */
	assignees: string[];
	/**   When the task was created */
	createdAt: string;
	/**   The last time the task was updated */
	lastUpdated: string;
	/**   The due date for the task if applicable */
	dueDate: string | null;
};

/**   The user's role in the project */
export type UserRole = 'admin' | 'beta-tester' | 'stable-user';

export type UserObject = {
	/**   The user's name */
	name: string;
	/**   The user's theme preference */
	theme: 'light' | 'dark' | 'oled' | 'system';
	/**   The user's preferred language */
	language: string;
	/**   The user's role */
	role: UserRole;
};

export interface TaskCardProps {
	t: TaskWrapper;
	projectId: string;
}

export type LazyIconType = React.LazyExoticComponent<
	OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
		muiName: string;
	}
>;

export interface LazyIconProps extends SvgIconProps {
	icon: LazyExoticComponent<
		OverridableComponent<SvgIconTypeMap<object, 'svg'>> & { muiName: string }
	>;

	size?: number; // fallback size for skeleton loading indicator
}

export interface ProjectCardProps {
	proj: ProjectWrapper;
}

export interface SettingsProps {
	mode: 'light' | 'dark';
	toggleColorMode: (newMode: 'light' | 'dark' | 'oled') => void;
}

export type LoginButtonState = {
	google: boolean;
	github: boolean;
	facebook: boolean;
};

export type ProviderName = 'google' | 'github' | 'facebook';

export type FeatureType = {
	title: string;
	description: string;
};

export interface FeatureCardProps {
	feature: FeatureType;
	index: number;
}

export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

export interface TaskChipProps {
	type: 'priority' | 'column' | 'type' | 'lifecycle';
	value:
		| ColumnType
		| Exclude<LifecycleType, null>
		| Exclude<LifecycleType, null>
		| Exclude<TaskPriority, null>
		| Exclude<TaskType, null>;
}

export interface AuthContextType {
	user: User | null;
	userData: UserWrapper | null;
	loading: boolean;
}

export interface FeedbackContextProps {
	message: string | null;
	type: FeedbackType;
	setFeedback: (msg: string, type?: FeedbackType) => void;
	clearFeedback: () => void;
}
