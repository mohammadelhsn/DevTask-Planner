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
import type { ColumnConfig, DevProjectObject } from './Types';
import type { TaskWrapper } from './Tasks';

/** ======= UTILITIES ======= */
import FirestoreResponse from './FirestoreResponse';
import type { FirebaseError } from 'firebase/app';

export class ProjectWrapper {
	/**   Project ID */
	id: string;
	/**   The name of the project */
	projectName: string;
	/**   The description of the project */
	projectDesc: string;
	/**   The config for the project */
	config: ColumnConfig[];
	/**   An array containing the tasks for the project */
	tasks: TaskWrapper[];
	/**   When the project was created */
	createdAt: Date;
	/**   When the project was last updated */
	lastUpdated: Date;
	constructor(props: DevProjectObject & { tasks?: TaskWrapper[] }) {
		this.id = props.id;
		this.projectName = props.projectName;
		this.projectDesc = props.projectDesc;
		this.config = props.config;
		this.tasks = props.tasks ?? [];
		this.createdAt = new Date(props.createdAt);
		this.lastUpdated = new Date(props.lastUpdated);
	}
	isEqual(to: ProjectWrapper) {
		return (
			this.projectName === to.projectName &&
			this.projectDesc === to.projectDesc &&
			JSON.stringify(this.config) === JSON.stringify(to.config)
		);
	}
	toFirestore(): DevProjectObject {
		return {
			id: this.id,
			projectName: this.projectName,
			projectDesc: this.projectDesc,
			config: this.config,
			createdAt: this.createdAt.toISOString(),
			lastUpdated: this.lastUpdated.toISOString(),
		};
	}
	/**
	 *   Finds the task if it exists
	 *
	 * @param {string} id The task's ID
	 */
	findTask(id: string) {
		return this.tasks.find((task) => task.id == id);
	}
	static fromFirestore(props: DevProjectObject & { tasks?: TaskWrapper[] }) {
		return new ProjectWrapper(props);
	}
}

export async function createProject(
	userId: string,
	project: Omit<DevProjectObject, 'id'>
): Promise<FirestoreResponse<ProjectWrapper>> {
	try {
		const projectsCol = collection(db, 'users', userId, 'projects');

		const docRef = await addDoc(projectsCol, {
			projectName: project.projectName,
			projectDesc: project.projectDesc,
			config: project.config,
			createdAt: project.createdAt,
			lastUpdated: project.lastUpdated,
		});

		await updateDoc(docRef, { id: docRef.id });

		const wrapper = new ProjectWrapper({
			...project,
			id: docRef.id,
		});

		return new FirestoreResponse({
			success: true,
			data: wrapper,
			error: null,
			message: 'Project created successfully',
		});
	} catch (error) {
		return new FirestoreResponse(error as Error);
	}
}

export async function updateProject(
	userId: string,
	projectId: string,
	project: ProjectWrapper
): Promise<FirestoreResponse<ProjectWrapper>> {
	const projectRef = doc(db, 'users', userId, 'projects', projectId);

	try {
		await updateDoc(projectRef, {
			projectName: project.projectName,
			projectDesc: project.projectDesc,
			config: project.config,
			lastUpdated: project.lastUpdated.toISOString(), // or firestore Timestamp if you're using that
		});

		return new FirestoreResponse({
			success: true,
			data: project,
			error: null,
			message: 'Updated project successfully!',
		});
	} catch (error) {
		console.error(error);
		return new FirestoreResponse(error as Error);
	}
}

export async function deleteProject(
	userId: string,
	projectId: string
): Promise<FirestoreResponse<void>> {
	const projectRef = doc(db, 'users', userId, 'projects', projectId);

	try {
		await deleteDoc(projectRef);

		return new FirestoreResponse({
			success: true,
			data: null,
			error: null,
			message: 'Updated project successfully!',
		});
	} catch (error) {
		console.error(error);
		return new FirestoreResponse(error as Error | FirebaseError);
	}
}
