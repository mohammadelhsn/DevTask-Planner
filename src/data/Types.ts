import type { ReactNode } from 'react';

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
	id: string;
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
};

/** @description The column the task belongs to */
export type ColumnType =
	| 'Long Term'
	| 'Short Term'
	| 'Medium Term'
	| 'Doing'
	| 'Done'
	| null;
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
