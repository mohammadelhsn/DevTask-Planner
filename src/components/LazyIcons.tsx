/** ======= REACT ======= */
import { lazy, Suspense } from 'react';

/** ======= MUI COMPONENTS ======= */
import Skeleton from '@mui/material/Skeleton';

/** ======= TYPES ======= */
import type { LazyIconProps } from '../data/Types';

/** ========== ICONS ========== */
export const InboxIcon = lazy(() => import('@mui/icons-material/Inbox'));
export const AddIcon = lazy(() => import('@mui/icons-material/Add'));
export const CheckCircleIcon = lazy(() => import('@mui/icons-material/CheckCircle'));
export const AutorenewIcon = lazy(() => import('@mui/icons-material/Autorenew'));
export const FlashOnIcon = lazy(() => import('@mui/icons-material/FlashOn'));
export const EventIcon = lazy(() => import('@mui/icons-material/Event'));
export const ScheduleIcon = lazy(() => import('@mui/icons-material/Schedule'));
export const SettingsIcon = lazy(() => import('@mui/icons-material/Settings'));
export const Brightness6Icon = lazy(() => import('@mui/icons-material/Brightness6'));
export const LightModeIcon = lazy(() => import('@mui/icons-material/LightMode'));
export const DarkModeIcon = lazy(() => import('@mui/icons-material/DarkMode'));
export const FolderOffIcon = lazy(() => import('@mui/icons-material/FolderOff'));
export const SaveIcon = lazy(() => import('@mui/icons-material/Save'));
export const EditIcon = lazy(() => import('@mui/icons-material/Edit'));

export const LazyIcon = ({ icon: Icon, size = 24, ...rest }: LazyIconProps) => {
    return (
        <Suspense fallback={<Skeleton variant="circular" width={size} height={size} />}>
            <Icon {...rest} />
        </Suspense>
    );
};