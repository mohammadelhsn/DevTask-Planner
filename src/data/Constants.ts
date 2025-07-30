import {
	AlphaIcon,
	AutorenewIcon,
	BetaIcon,
	BugIcon,
	CheckCircleIcon,
	EventIcon,
	FeatureIcon,
	FlashOnIcon,
	InboxIcon,
	PriorityHighIcon,
	PriorityLowIcon,
	PriorityMedIcon,
	ScheduleIcon,
	StableIcon,
} from '../components/LazyIcons';
import type {
	ColumnType,
	LazyIconType,
	LifecycleType,
	TaskPriority,
	TaskType,
} from './Types';
import {
	FacebookAuthProvider,
	GoogleAuthProvider,
	GithubAuthProvider,
} from 'firebase/auth';

export const lifecycles = ['alpha', 'beta', 'stable'] as const;
export const types = ['feature', 'bug'] as const;
export const priorities = ['high', 'medium', 'low'] as const;

export const categoryIcons: Record<Exclude<ColumnType, null>, LazyIconType> = {
	Uncategorized: InboxIcon,
	'Long Term': ScheduleIcon,
	'Medium Term': EventIcon,
	'Short Term': FlashOnIcon,
	Doing: AutorenewIcon,
	Done: CheckCircleIcon,
};

export const priorityIcons: Record<
	Exclude<TaskPriority, null>,
	LazyIconType
> = {
	high: PriorityHighIcon,
	medium: PriorityMedIcon,
	low: PriorityLowIcon,
};

export const lifecycleIcons: Record<
	Exclude<LifecycleType, null>,
	LazyIconType
> = {
	alpha: AlphaIcon,
	beta: BetaIcon,
	stable: StableIcon,
};

export const typeIcons: Record<Exclude<TaskType, null>, LazyIconType> = {
	bug: BugIcon,
	feature: FeatureIcon,
};

export const features = [
	{
		title: 'Task Management',
		description: 'Organize your tasks with tags, priorities, and deadlines.',
	},
	{
		title: 'Kanban Board',
		description: 'Visualize progress with columns.',
	},
	// {
	//     title: 'Dev Focused',
	//     description: 'Built with developers in mind. Clean. Fast. Logical.',
	// },
	{
		title: 'Team Collaboration',
		description: 'Assign tasks and keep everyone on the same page.',
	},
	{
		title: 'Dark Mode',
		description: 'Because we know light mode burns your eyes.',
	},
	// {
	//     title: 'Git Integration',
	//     description: 'Link pull requests and commits directly to tasks.',
	// },
];

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
