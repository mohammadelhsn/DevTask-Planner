export const SIGNUP = '/signup';
export const LOGIN = '/login';
export const DASHBOARD = '/dashboard';
export const NEW_PROJECT = '/project/new';
export const VIEW_PROJECT = (projectId: string) => `/project/${projectId}`;
export const NEW_TASK = (projectId: string) =>
	`/project/${projectId}/tasks/new`;
export const VIEW_TASK = (projectId: string, taskId: string) =>
	`/project/${projectId}/tasks/${taskId}`;
export const SETTINGS = '/settings';
