/**
 *   The link for the dashboard
 */
export const DASHBOARD = '/dashboard';

/**
 *   The link for the login
 */
export const LOGIN = '/login';

/**
 *   The link for the new project
 */
export const NEW_PROJECT = '/project/new';

/**
 *   Creates a link to create a new task
 *
 * @param projectId The ID of the project you'd like to create a new task in
 * @returns A valid link for creation
 */
export const NEW_TASK = (projectId: string) =>
	`/project/${projectId}/tasks/new`;

/**
 *   The settings page
 */
export const SETTINGS = '/settings';

/**
 *   The Sign Up Page
 */
export const SIGNUP = '/signup';

/**
 *   Creates a valid link to view a project
 *
 * @param projectId The ID of the project you'd like to view
 * @returns Returns the valid link to view a project
 */
export const VIEW_PROJECT = (projectId: string) => `/project/${projectId}`;

/**
 *   Returns a valid link to view the task given a project ID and task ID
 *
 * @param projectId The ID of the project that the task is in
 * @param taskId The ID of the task you'd like to view
 * @returns A valid link to view the task
 */
export const VIEW_TASK = (projectId: string, taskId: string) =>
	`/project/${projectId}/tasks/${taskId}`;
