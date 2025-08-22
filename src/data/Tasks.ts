/** ======= FIREBASE ======= */
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	updateDoc,
} from 'firebase/firestore';
import { db } from './Firebase';

/** ======= TYPES ======= */
import type { ColumnType, TaskObject } from './Types';

/** ======= UTILITIES ======= */
import FirestoreResponse from './FirestoreResponse';

export class TaskWrapper {
	/**   The task's ID */
	id: string;
	/**   The task's title */
	title: string;
	/**   The task's description */
	description: string;
	/**   The column the task belongs to */
	column: ColumnType;
	/**   The lifecycle stage that the task is in */
	lifecycle: 'alpha' | 'beta' | 'stable' | null;
	/**   The type of task it is  */
	type: 'feature' | 'bug' | null;
	/**   The priority of the task */
	priority: 'high' | 'medium' | 'low' | null;
	/**   The people assigned to the task */
	assignees: string[];
	/**   When the task was created */
	createdAt: Date;
	/**   The last time the task was updated */
	lastUpdated: Date;
	/**   The due date for the task if applicable */
	dueDate: Date | null;
	constructor(props: TaskObject) {
		this.id = props.id;
		this.title = props.title;
		this.description = props.description;
		this.column = props.column;
		this.lifecycle = props.lifecycle;
		this.type = props.type;
		this.priority = props.priority;
		this.assignees = props.assignees;
		this.createdAt = new Date(props.createdAt);
		this.lastUpdated = new Date(props.lastUpdated);
		this.dueDate = props.dueDate ? new Date(props.dueDate) : null;
	}
	/**   Returns Firestore Compatible data for storage */
	toFirestore(): TaskObject {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			column: this.column,
			lifecycle: this.lifecycle,
			type: this.type,
			priority: this.priority,
			assignees: this.assignees,
			createdAt: this.createdAt.toISOString(),
			lastUpdated: this.lastUpdated.toISOString(),
			dueDate: this.dueDate ? this.dueDate.toISOString() : null,
		};
	}
	/**   Deep equals to see if any changes occurred */
	isEqual(other: TaskWrapper): boolean {
		return (
			this.id === other.id &&
			this.title === other.title &&
			this.description === other.description &&
			this.column === other.column &&
			this.priority === other.priority &&
			this.lifecycle === other.lifecycle &&
			this.type === other.type &&
			this.assignees.length === other.assignees.length &&
			this.assignees.every((a, i) => a === other.assignees[i]) &&
			this.createdAt.getTime() === other.createdAt.getTime() &&
			this.lastUpdated.getTime() === other.lastUpdated.getTime() &&
			((this.dueDate === null && other.dueDate === null) ||
				(this.dueDate !== null &&
					other.dueDate !== null &&
					this.dueDate.getTime() === other.dueDate.getTime()))
		);
	}
	/**   Get a task wrapper from raw data */
	static fromFirestore(rawData: TaskObject) {
		return new TaskWrapper(rawData);
	}
	/**   Static variant of isEqual */
	static equals(task1: TaskWrapper, task2: TaskWrapper) {
		return task1.isEqual(task2);
	}
}

/**
 *   Creates a blank task
 *
 * @param userId The user's UID
 * @param projectId The project's ID
 * @param task The Task Data
 * @returns FirestoreResponse depending on the state of the write
 */
export async function createTask(
	userId: string,
	projectId: string,
	task: Omit<TaskObject, 'id'>
): Promise<FirestoreResponse<TaskWrapper>> {
	try {
		const tasksCol = collection(
			db,
			'users',
			userId,
			'projects',
			projectId,
			'tasks'
		);

		// Step 1: Add the task without id
		const docRef = await addDoc(tasksCol, task);

		// Step 2: Update it with the generated Firestore ID
		await updateDoc(docRef, { id: docRef.id });

		// Step 3: Wrap it in TaskWrapper and return
		const wrappedTask = new TaskWrapper({
			...task,
			id: docRef.id,
		});

		return new FirestoreResponse({
			success: true,
			data: wrappedTask,
			error: null,
			message: 'Task created successfully',
		});
	} catch (error) {
		console.error(error);
		return new FirestoreResponse(error as Error);
	}
}

/**
 *   Updates a task in Firestore
 * @param userId - ID of the current user
 * @param projectId - ID of the project
 * @param task - TaskWrapper with updated data
 * @returns FirestoreResponse
 */
export async function updateTask(
	userId: string,
	projectId: string,
	task: TaskWrapper
): Promise<FirestoreResponse<TaskWrapper>> {
	try {
		const taskRef = doc(
			db,
			'users',
			userId,
			'projects',
			projectId,
			'tasks',
			task.id
		);

		// Update the task
		await updateDoc(taskRef, task.toFirestore());

		// Return success response
		return new FirestoreResponse({
			success: true,
			data: task,
			error: null,
			message: 'Task updated successfully.',
		});
	} catch (error) {
		return new FirestoreResponse(error as Error);
	}
}

/**
 *   Deletes a task from Firestore
 * @param userId - ID of the user
 * @param projectId - ID of the project
 * @param taskId - ID of the task to delete
 * @returns FirestoreResponse with success/failure
 */
export async function deleteTask(
	userId: string,
	projectId: string,
	taskId: string
): Promise<FirestoreResponse<null>> {
	try {
		const taskRef = doc(
			db,
			'users',
			userId,
			'projects',
			projectId,
			'tasks',
			taskId
		);
		await deleteDoc(taskRef);

		return new FirestoreResponse({
			success: true,
			data: null,
			error: null,
			message: 'Task deleted successfully.',
		});
	} catch (error) {
		return new FirestoreResponse(error as Error);
	}
}
