/** ======= MUI COMPONENTS ======= */

import Chip from '@mui/material/Chip';

/** =======  TYPES, CONSTANTS, STYLES & FUNCTIONS ======= */
import { capitalize, getChipColor, getLifecycleColor, getPriorityColor } from '../data/Functions';
import type { ColumnType, LazyIconType, LifecycleType, TaskChipProps, TaskPriority, TaskType } from '../data/Types';
import { categoryIcons, lifecycleIcons, priorityIcons, typeIcons } from '../data/Constants';
import { chipStyles } from '../data/Styles';

/** ======= CUSTOM COMPONENTS ======= */
import { LazyIcon } from './LazyIcons';

const TaskChip = ({ type, value }: TaskChipProps) => {
    let color: "primary" | "warning" | "info" | "success" | "error" | "default" | "secondary";
    let iconsDict: Record<ColumnType, LazyIconType> | Record<"alpha" | "beta" | "stable", LazyIconType> | Record<"high" | "medium" | "low", LazyIconType> | Record<"feature" | "bug", LazyIconType>;
    let variant: 'outlined' | 'filled' = 'filled';
    switch (type) {
        case 'column':
            color = 'primary';
            iconsDict = categoryIcons;
            variant = 'outlined';
            break;
        case 'lifecycle':
            color = getLifecycleColor(value as Exclude<LifecycleType, null>);
            iconsDict = lifecycleIcons;
            break;

        case 'priority':
            color = getPriorityColor(value as Exclude<TaskPriority, null>);
            iconsDict = priorityIcons;
            break;

        case 'type':
        default:
            color = getChipColor(value as Exclude<TaskType, null>);
            iconsDict = typeIcons;
    }

    return (
        <Chip
            color={color}
            label={capitalize(value)}
            sx={chipStyles}
            variant={variant}
            icon={<LazyIcon icon={iconsDict[value as keyof typeof iconsDict]} />}>
        </Chip>
    );
};

export default TaskChip;