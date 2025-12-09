import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {MantineProvider} from '@mantine/core';
import {DatesProvider} from '@mantine/dates';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './index.css';
import App from './app/App';
import {AuthProvider} from './features/auth/AuthContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                <DatesProvider settings={{locale: 'ru', firstDayOfWeek: 1}}>
                    <AuthProvider>
                        <BrowserRouter>
                            <App/>
                        </BrowserRouter>
                    </AuthProvider>
                </DatesProvider>
            </MantineProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
