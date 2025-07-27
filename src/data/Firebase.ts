import { FirebaseError, initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, type AuthProvider } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { UserWrapper } from './User';
import FirestoreResponse from './FirestoreResponse';

const firebaseConfig = {
	apiKey: 'AIzaSyDK0v4L8ylOZEGJld2ylA1-rqomv9hMTjA',
	authDomain: 'devtask-planner.firebaseapp.com',
	projectId: 'devtask-planner',
	storageBucket: 'devtask-planner.firebasestorage.app',
	messagingSenderId: '372993150113',
	appId: '1:372993150113:web:67ba3a4eadd6416356f4e0',
	measurementId: 'G-0S83MMBJYE',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

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
