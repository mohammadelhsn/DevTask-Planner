/** ======= FIREBASE ======= */
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from './Firebase';

/** ======= TYPES ======= */
import type { ProjectWrapper } from './Project';
import type { UserRole, UserObject } from './Types';

/** ======= UTILITIES ======= */
import FirestoreResponse from './FirestoreResponse';

export class UserWrapper {
	/**   The user's name */
	name: string;
	/**   The user's theme preference */
	theme: 'light' | 'dark' | 'oled' | 'system';
	/**   The user's preferred language */
	language: string;
	/**   The user's role */
	role: UserRole;
	/**   An array containing the users projects / tasks */
	projects: ProjectWrapper[];
	constructor(rawObject: UserObject & { projects?: ProjectWrapper[] }) {
		this.name = rawObject.name;
		this.theme = rawObject.theme;
		this.language = rawObject.language;
		this.role = rawObject.role;
		this.projects = rawObject.projects ?? [];
	}
	/**
	 *   Update the user's name
	 *
	 * @param {string} newName The user's new name
	 */
	updateName(newName: string) {
		this.name = newName;
		return this;
	}
	/**
	 *   Updates the user's theme
	 *
	 * @param newTheme The new setting for the theme
	 */
	updateTheme(newTheme: 'light' | 'dark' | 'oled' | 'system') {
		this.theme = newTheme;
		return this;
	}
	/**
	 *   Updates the theme for the user
	 *
	 * @param {string} newLang The new language for the user
	 */
	updateLanguage(newLang: string) {
		this.language = newLang;
		return this;
	}
	/**   Determines if the user is an admin */
	isAdmin() {
		return this.role == 'admin';
	}
	/**   Determines if the user is a beta tester */
	isBetaTester() {
		return this.role == 'beta-tester' || this.isAdmin();
	}
	/**
	 *   This method returns firestore compatible version of the data for storage
	 */
	toFirestore() {
		const obj: UserObject = {
			name: this.name,
			theme: this.theme,
			language: this.language,
			role: this.role,
		};
		return obj;
	}
	/**
	 *   Finds the project (if it exists) given an ID
	 *
	 * @param id The ID of the project to find
	 * @returns Project Wrapper of the project if it exists
	 */
	findProject(id: string) {
		return this.projects.find((proj) => proj.id === id);
	}
	/**   Helper to wrap the raw user data to UserWrapper class */
	static fromFirestore(rawObject: UserObject) {
		return new UserWrapper(rawObject);
	}
}

/**
 *   Fetches UserData from Users Collection
 *
 * @param uid The user's UID
 * @returns Firestore Response depending on success status
 */
export async function fetchUser(
	uid: string
): Promise<FirestoreResponse<UserWrapper | null>> {
	try {
		const docRef = doc(db, 'users', uid);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return new FirestoreResponse({
				success: false,
				data: null,
				error: null,
				message: 'User not found.',
			});
		}

		const data = docSnap.data() as UserObject;
		const user = UserWrapper.fromFirestore(data);

		return new FirestoreResponse({
			success: true,
			data: user,
			error: null,
			message: 'User successfully fetched.',
		});
	} catch (error) {
		console.error(error);
		return new FirestoreResponse(error as FirebaseError | Error);
	}
}

export async function saveUser(
	uid: string,
	user: UserWrapper
): Promise<FirestoreResponse<void>> {
	try {
		const docRef = doc(db, 'users', uid);
		await setDoc(docRef, user.toFirestore());

		return new FirestoreResponse({
			success: true,
			data: null,
			error: null,
			message: 'User saved successfully.',
		});
	} catch (error) {
		console.error(error);
		return new FirestoreResponse(error as FirebaseError | Error);
	}
}

export async function createUser(
	uid: string,
	userData: Partial<UserObject>
): Promise<FirestoreResponse<void>> {
	if (!uid) {
		return new FirestoreResponse(new Error('User ID is required'));
	}

	try {
		const user: UserObject = {
			name: userData.name || 'New User',
			theme: userData.theme || 'system',
			language: userData.language || 'en',
			role: userData.role || 'stable-user',
		};

		const userRef = doc(db, 'users', uid);
		await setDoc(userRef, user);

		return new FirestoreResponse({
			success: true,
			data: null,
			error: null,
			message: 'User created successfully.',
		});
	} catch (error) {
		console.error(error);
		return new FirestoreResponse(error as FirebaseError | Error);
	}
}
