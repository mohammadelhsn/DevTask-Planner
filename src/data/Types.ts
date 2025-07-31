/** ======= TYPES ======= */
import type { LazyExoticComponent, ReactNode } from 'react';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import type { SvgIconProps, SvgIconTypeMap } from '@mui/material';

import type { ProjectWrapper } from './Project';
import type { TaskWrapper } from './Tasks';

export type ParentComp = { children: ReactNode };

export type FirestoreRawData<T> = {
	/** @description Success state of the operation */
	success: boolean;
	/** @description Data */
	data: T | null;
	/** @description The error itself (non readable version) */
	error: string | null;
	/** @description Response message for the user */
	message: string;
};

export type ColumnConfig = {
	/** @description The ID of the Column */
	id: ColumnType;
	/** @description Whether the category is enabled */
	enabled: boolean;
	/** @description The label for the category */
	label: string;
};

export type DevProjectObject = {
	/** @description Project ID */
	id: string;
	/** @description The name of the project */
	projectName: string;
	/** @description The description of the project */
	projectDesc: string;
	/** @description The config for the project */
	config: ColumnConfig[];
	/** @description When the project was created */
	createdAt: string;
	/** @description When the project was last updated */
	lastUpdated: string;
};

/** @description The column the task belongs to */
export type ColumnType =
	| 'Long Term'
	| 'Short Term'
	| 'Medium Term'
	| 'Doing'
	| 'Done'
	| 'Uncategorized';
/** @description The lifecycle stage that the task is in */
export type LifecycleType = 'alpha' | 'beta' | 'stable' | null;
/** @description The type of task it is  */
export type TaskType = 'feature' | 'bug' | null;
/** @description The priority of the task */
export type TaskPriority = 'high' | 'medium' | 'low' | null;

export type TaskObject = {
	/** @description The ID of the task */
	id: string;
	/** @description The title of the task */
	title: string;
	/** @description The description of the task */
	description: string;
	/** @description The column the task belongs to */
	column: ColumnType;
	/** @description The lifecycle stage that the task is in */
	lifecycle: LifecycleType;
	/** @description The type of task it is  */
	type: TaskType;
	/** @description The priority of the task */
	priority: TaskPriority;
	/** @description The people assigned to the task */
	assignees: string[];
	/** @description When the task was created */
	createdAt: string;
	/** @description The last time the task was updated */
	lastUpdated: string;
	/** @description The due date for the task if applicable */
	dueDate: string | null;
};

/** @description The user's role in the project */
export type UserRole = 'admin' | 'beta-tester' | 'stable-user';

export type UserObject = {
	/** @description The user's name */
	name: string;
	/** @description The user's theme preference */
	theme: 'light' | 'dark' | 'oled' | 'system';
	/** @description The user's preferred language */
	language: string;
	/** @description The user's role */
	role: UserRole;
};

export interface TaskCardProps {
	t: TaskWrapper;
	projectId: string;
}

export type LazyIconType = React.LazyExoticComponent<
	OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
		muiName: string;
	}
>;

export interface LazyIconProps extends SvgIconProps {
	icon: LazyExoticComponent<
		OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }
	>;

	size?: number; // fallback size for skeleton loading indicator
}

export interface ProjectCardProps {
	proj: ProjectWrapper;
}

export interface SettingsProps {
	mode: 'light' | 'dark';
	toggleColorMode: (newMode: any) => void;
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
