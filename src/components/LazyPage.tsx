/** ======= REACT ======= */
import { Suspense, type ComponentType, type FC } from 'react';

/** ======= COMPONENTS ======= */
import LoadingPlaceholder from './LoadingPlaceholder';

export type LazyPageProps = {
    component: ComponentType<any>;
    componentProps?: any;
};

const LazyPage: FC<LazyPageProps> = ({ component: Component, componentProps }) => {
    return (
        <Suspense fallback={<LoadingPlaceholder />}>
            <Component {...componentProps} />
        </Suspense>
    );
};

export default LazyPage;
