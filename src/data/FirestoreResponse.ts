/** ======= FIREBASE ======= */
import { FirebaseError } from 'firebase/app';

/** ======= TYPES ======= */
import type { FirestoreRawData } from './Types';

export const firebaseErrors: Record<string, string> = {
	'auth/invalid-email': 'The email address is badly formatted.',
	'auth/user-disabled': 'This user account has been disabled.',
	'auth/user-not-found': 'No account found with this email.',
	'auth/wrong-password': 'Incorrect password.',
	'auth/email-already-in-use':
		'Email is already registered with another account.',
	'auth/weak-password': 'Password is too weak.',
	'auth/too-many-requests': 'Too many attempts. Try again later.',
	'auth/operation-not-allowed': 'This sign-in method is not enabled.',
	'auth/account-exists-with-different-credential':
		'Account exists with different sign-in method.',
	'permission-denied': 'You do not have permission to perform this action.',
	unavailable: 'Service is temporarily unavailable. Please try again later.',
	'deadline-exceeded': 'Request timed out. Please try again.',
	'not-found': 'Requested resource was not found.',
	'resource-exhausted': 'Resource limit reached. Please try again later.',
	internal: 'An internal error occurred. Please try again.',
	unauthenticated: 'You need to be signed in to continue.',
};

export default class FirestoreResponse<T> {
	/** @description Success state of the operation */
	success: boolean;
	/** @description Data if applicable */
	data: T | null;
	/** @description The error itself (non readable version) */
	error: string | null;
	/** @description Response message for the user */
	message: string;
	constructor(data: FirestoreRawData<T> | FirebaseError | Error) {
		if (data instanceof FirebaseError) {
			this.success = false;
			this.data = null;
			this.error = data.code;
			this.message =
				firebaseErrors[data.code] || 'An unknown Firebase error occurred!';
		} else if (data instanceof Error) {
			this.success = false;
			this.data = null;
			this.error = data.message;
			this.message = 'Oops, an unexpected error has occurred!';
		} else {
			this.success = data.success;
			this.data = data.data;
			this.error = data.error;
			this.message = data.message;
		}
	}
	updateMessage(newMessage: string) {
		this.message = newMessage;
		return this;
	}
}
