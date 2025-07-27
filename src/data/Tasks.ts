import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from './Firebase';
import FirestoreResponse from './FirestoreResponse';

export type TaskObject = {
	id: string;
	title: string;
	description: string;
	column: 'Long Term' | 'Short Term' | 'Medium Term' | 'Doing' | 'Done' | null;
	lifecycle: 'alpha' | 'beta' | 'stable' | null;
	type: 'feature' | 'bug' | null;
	priority: 'high' | 'medium' | 'low' | null;
	assignees: string[];
};

export class TaskWrapper {
	id: string;
	title: string;
	description: string;
	column: 'Long Term' | 'Short Term' | 'Medium Term' | 'Doing' | 'Done' | null;
	lifecycle: 'alpha' | 'beta' | 'stable' | null;
	type: 'feature' | 'bug' | null;
	priority: 'high' | 'medium' | 'low' | null;
	assignees: string[];
	constructor(props: TaskObject) {
		this.id = props.id;
		this.title = props.title;
		this.description = props.description;
		this.column = props.column;
		this.lifecycle = props.lifecycle;
		this.type = props.type;
		this.priority = props.priority;
		this.assignees = props.assignees;
	}
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
		};
	}
	static fromFirestore(rawData: TaskObject) {
		return new TaskWrapper(rawData);
	}
}

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
