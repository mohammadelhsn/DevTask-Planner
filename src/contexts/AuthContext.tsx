/** ======= REACT ======= */
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

/** ======= FIREBASE AUTH ======= */
import { onAuthStateChanged, type User } from 'firebase/auth';

/** ======= FIREBASE FIRESTORE ======= */
import { doc, onSnapshot, collection, getDocs } from 'firebase/firestore';

/** ======= LOCAL FIREBASE SETUP ======= */
import { auth, db } from '../data/Firebase';

/** ======= WRAPPERS & TYPES ======= */
import { UserWrapper } from '../data/User';
import { ProjectWrapper } from '../data/Project';
import { TaskWrapper } from '../data/Tasks';
import type { UserObject, DevProjectObject, TaskObject } from '../data/Types';


interface AuthContextType {
    user: User | null;
    userData: UserWrapper | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: ReactNode; }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserWrapper | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubUser: (() => void) | null = null;
        let unsubProjects: (() => void) | null = null;
        const unsubTasksArr: (() => void)[] = [];

        const unsubAuth = onAuthStateChanged(auth, (user) => {
            setUser(user);

            if (!user) {
                setUserData(null);
                setLoading(false);
                unsubUser && unsubUser();
                unsubProjects && unsubProjects();
                unsubTasksArr.forEach((unsub) => unsub());
                return;
            }

            const uid = user.uid;
            const userRef = doc(db, 'users', uid);

            unsubUser = onSnapshot(userRef, async (userSnap) => {
                if (!userSnap.exists()) {
                    setUserData(null);
                    setLoading(false);
                    return;
                }

                const userDoc = userSnap.data() as UserObject;
                const userWrapper = new UserWrapper(userDoc);

                const projectsRef = collection(db, 'users', uid, 'projects');

                // assign, don't redeclare
                unsubProjects = onSnapshot(projectsRef, async (projectSnaps) => {
                    // clean up old task listeners before adding new ones
                    unsubTasksArr.forEach((unsub) => unsub());
                    unsubTasksArr.length = 0;

                    const updatedProjects = await Promise.all(
                        projectSnaps.docs.map(async (projectDoc) => {
                            const projectData = projectDoc.data() as DevProjectObject;
                            const projectId = projectDoc.id;

                            const tasksRef = collection(db, 'users', uid, 'projects', projectId, 'tasks');
                            const tasksSnap = await getDocs(tasksRef);

                            const initialTasks = tasksSnap.docs.map((taskDoc) =>
                                TaskWrapper.fromFirestore({
                                    ...taskDoc.data(),
                                    id: taskDoc.id,
                                } as TaskObject)
                            );

                            const project = ProjectWrapper.fromFirestore({
                                ...projectData,
                                tasks: initialTasks,
                            });

                            // subscribe to live tasks updates
                            const unsubTasks = onSnapshot(tasksRef, (taskSnaps) => {
                                const liveTasks = taskSnaps.docs.map((doc) =>
                                    TaskWrapper.fromFirestore({
                                        ...doc.data(),
                                        id: doc.id,
                                    } as TaskObject)
                                );

                                const index = userWrapper.projects.findIndex(
                                    (p) => p.projectName === project.projectName
                                );

                                if (index !== -1) {
                                    userWrapper.projects[index].tasks = liveTasks;
                                } else {
                                    userWrapper.projects.push(
                                        ProjectWrapper.fromFirestore({
                                            ...projectData,
                                            tasks: liveTasks,
                                        })
                                    );
                                }

                                setUserData(userWrapper);
                                setLoading(false); // set loading false after update
                            });

                            unsubTasksArr.push(unsubTasks);
                            return project;
                        })
                    );

                    userWrapper.projects = updatedProjects;
                    setUserData(userWrapper);
                    setLoading(false); // set loading false after projects loaded
                });
            });
        });

        return () => {
            unsubAuth();
            unsubUser && unsubUser();
            unsubProjects && unsubProjects();
            unsubTasksArr.forEach((unsub) => unsub());
        };
    }, []);


    return (
        <AuthContext.Provider value={{ user, userData, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
