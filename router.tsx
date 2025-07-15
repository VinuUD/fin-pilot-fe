import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
} from '@tanstack/react-router';
import DashboardPage from './src/pages/DashboardPage';
import StrategyBuilder from './src/components/StrategyBuilder/StrategyBuilder';

const rootRoute = createRootRoute({
    component: () => <div><Outlet /></div>,
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: DashboardPage,
});

const strategyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/strategy',
    component: StrategyBuilder,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            name: typeof search.name === 'string' ? search.name : '',
        };
    },
});

const routeTree = rootRoute.addChildren([homeRoute, strategyRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}