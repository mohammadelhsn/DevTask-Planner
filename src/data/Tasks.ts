/** ======= FIREBASE ======= */
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from './Firebase';

/** ======= TYPES ======= */
import type { ColumnType, TaskObject } from './Types';

/** ======= UTILITIES ======= */
import FirestoreResponse from './FirestoreResponse';

export class TaskWrapper {
	/** @description The task's ID */
	id: string;
	/** @description The task's title */
	title: string;
	/** @description The task's description */
	description: string;
	/** @description The column the task belongs to */
	column: ColumnType;
	/** @description The lifecycle stage that the task is in */
	lifecycle: 'alpha' | 'beta' | 'stable' | null;
	/** @description The type of task it is  */
	type: 'feature' | 'bug' | null;
	/** @description The priority of the task */
	priority: 'high' | 'medium' | 'low' | null;
	/** @description The people assigned to the task */
	assignees: string[];
	/** @description When the task was created */
	createdAt: Date;
	/** @description The last time the task was updated */
	lastUpdated: Date;
	/** @description The due date for the task if applicable */
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
		this.createdAt = props.createdAt;
		this.lastUpdated = props.lastUpdated;
		this.dueDate = props.dueDate;
	}
	/** @description Returns Firestore Compatible data for storage */
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
			createdAt: this.createdAt,
			lastUpdated: this.lastUpdated,
			dueDate: this.dueDate,
		};
	}
	/** @description Deep equals to see if any changes occurred */
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
	/** @description Get a task wrapper from raw data */
	static fromFirestore(rawData: TaskObject) {
		return new TaskWrapper(rawData);
	}
	/** @description Static variant of isEqual */
	static equals(task1: TaskWrapper, task2: TaskWrapper) {
		return task1.isEqual(task2);
	}
}

/**
 * @description Creates a blank task
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
