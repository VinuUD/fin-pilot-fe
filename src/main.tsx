import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from '@tanstack/react-router';
import {Provider} from 'react-redux';
import {store} from './store';
import {router} from '../router';
import './index.css';

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <App>
                    <RouterProvider router={router} />
                </App>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
);