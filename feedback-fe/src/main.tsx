import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import App from './App.tsx';
import './index.css';
import { AppContextProvider } from '@/contexts/app.context.tsx';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false
		}
	}
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<AppContextProvider>
					<App />
					<ReactQueryDevtools initialIsOpen={false} />
					<Toaster />
				</AppContextProvider>
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>
);
