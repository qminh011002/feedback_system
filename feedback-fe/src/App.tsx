import { AppContextProvider } from '@/contexts/app.context';
import useRouteElement from '@/hooks/useRouteElement';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { Toaster } from 'react-hot-toast';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false
		}
	}
});
export default function App() {
	const router = useRouteElement();

	return (
		<React.Fragment>
			<QueryClientProvider client={queryClient}>
				<AppContextProvider>
					{router}
					<ReactQueryDevtools initialIsOpen={false} />
					<Toaster />
				</AppContextProvider>
			</QueryClientProvider>
		</React.Fragment>
	);
}
