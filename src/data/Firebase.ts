/** ======= FIREBASE CORE ======= */
import { FirebaseError, initializeApp } from 'firebase/app';

/** ======= FIREBASE AUTH ======= */
import {
	getAuth,
	signInWithPopup,
	signOut,
	type AuthProvider,
} from 'firebase/auth';

/** ======= FIREBASE FIRESTORE ======= */
import {
	doc,
	getDoc,
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager,
	setDoc,
} from 'firebase/firestore';

/** ======= UTILITIES & WRAPPERS ======= */
import FirestoreResponse from './FirestoreResponse';
import { UserWrapper } from './User';

const firebaseConfig = {
	apiKey: 'AIzaSyDK0v4L8ylOZEGJld2ylA1-rqomv9hMTjA',
	authDomain: 'devtask-planner.firebaseapp.com',
	projectId: 'devtask-planner',
	storageBucket: 'devtask-planner.firebasestorage.app',
	messagingSenderId: '372993150113',
	appId: '1:372993150113:web:67ba3a4eadd6416356f4e0',
	measurementId: 'G-0S83MMBJYE',
};

/**   Firebase App */
const app = initializeApp(firebaseConfig);
/**   Firebase Auth Instance */
export const auth = getAuth(app);
/**   Firebase Firestore instance */
export const db = initializeFirestore(app, {
	localCache: persistentLocalCache({
		tabManager: persistentMultipleTabManager(),
	}),
});

/**
 *   Handles Provider Sign Up, including posting new data
 *
 * @param provider The provider to use for pop up
 * @returns Firestore Response depending on success state
 */
export async function handleProviderSignUp(
	provider: AuthProvider
): Promise<FirestoreResponse<null>> {
	try {
		const result = await signInWithPopup(auth, provider);
		const fUser = result.user;

		if (!fUser) {
			return new FirestoreResponse({
				success: false,
				data: null,
				error: null,
				message: 'Authentication failed: no user returned.',
			});
		}

		const userRef = doc(db, 'users', fUser.uid);
		const docSnap = await getDoc(userRef);

		if (!docSnap.exists()) {
			const userWrapper = new UserWrapper({
				theme: 'system',
				role: 'stable-user',
				language: 'en',
				name: fUser.displayName || fUser.email || 'New User',
			});

			await setDoc(userRef, userWrapper.toFirestore(), { merge: true });
		}

		return new FirestoreResponse({
			success: true,
			data: null,
			error: null,
			message: 'Sign-up successful!',
		});
	} catch (error) {
		console.error(error);
		return new FirestoreResponse(error as FirebaseError);
	}
}

/**
 *   Handles provider sign in
 *
 * @param provider The provider for the pop up
 * @returns Firestore response object depending on success state
 */
export async function handleProviderSignIn(
	provider: AuthProvider
): Promise<FirestoreResponse<null>> {
	try {
		await signInWithPopup(auth, provider);
		return new FirestoreResponse({
			success: true,
			data: null,
			error: null,
			message: 'Sign-in successful!',
		});
	} catch (error) {
		console.error(error);
		return new FirestoreResponse(error as FirebaseError);
	}
}

export const signOutUser = () => signOut(auth);
