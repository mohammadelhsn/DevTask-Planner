import { addDoc, collection, updateDoc } from 'firebase/firestore';
import FirestoreResponse from './FirestoreResponse';
import type { TaskWrapper } from './Tasks';
import { db } from './Firebase';

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
	config: {
		columnsConfig: ColumnConfig[];
	};
};

export class ProjectWrapper {
	/** @description Project ID */
	id: string;
	/** @description The name of the project */
	projectName: string;
	/** @description The description of the project */
	projectDesc: string;
	/** @description The config for the project */
	config: { columnsConfig: ColumnConfig[] };
	/** @description An array containing the tasks for the project */
	tasks: TaskWrapper[];
	constructor(props: DevProjectObject & { tasks?: TaskWrapper[] }) {
		this.id = props.id;
		this.projectName = props.projectName;
		this.projectDesc = props.projectDesc;
		this.config = props.config;
		this.tasks = props.tasks ?? []; // Initialize tasks or empty array
	}
	toFirestore(): DevProjectObject {
		return {
			id: this.id,
			projectName: this.projectName,
			projectDesc: this.projectDesc,
			config: this.config,
		};
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

		// Step 1: Add doc without ID
		const docRef = await addDoc(projectsCol, {
			projectName: project.projectName,
			projectDesc: project.projectDesc,
			config: project.config,
		});

		// Step 2: Update with the generated ID
		await updateDoc(docRef, { id: docRef.id });

		// Step 3: Build ProjectWrapper with ID and return
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
