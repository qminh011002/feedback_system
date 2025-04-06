/* eslint-disable react-refresh/only-export-components */
import { useAppContext } from '@/contexts/app.context';
import MainLayout from '@/layouts/main-layout';
import DetailFeedbackPage from '@/pages/DetailFeedbackPage/detail-feedback-page';
import { FeedbackContextProvider } from '@/pages/FeedbackPage/context/feedback.context';
import FeedbackPage from '@/pages/FeedbackPage/feedback-page';
import LoginPage from '@/pages/login-page';
import NotfoundPage from '@/pages/not-found-page';
import { Navigate, Outlet, useRoutes } from 'react-router';

const ProtectRoute = () => {
	const { isAuth } = useAppContext();

	if (!isAuth) {
		return <Navigate to='/login' replace />;
	}

	return <Outlet />;
};

const RejectRoute = () => {
	const { isAuth } = useAppContext();

	if (isAuth) {
		return <Navigate to='/' replace />;
	}

	return <Outlet />;
};

export default function useRouteElement() {
	const router = useRoutes([
		{
			path: '/',
			element: <ProtectRoute />,
			children: [
				{
					path: '',
					element: <MainLayout />,
					children: [
						{
							index: true,
							element: (
								<FeedbackContextProvider>
									<FeedbackPage />
								</FeedbackContextProvider>
							)
						},
						{
							path: 'feedback/:id',
							element: <DetailFeedbackPage />
						}
					]
				}
			]
		},
		{
			path: '/login',
			element: <RejectRoute />,
			children: [
				{
					path: '/login',
					element: <LoginPage />
				}
			]
		},
		{
			path: '*',
			element: <NotfoundPage />
		}
	]);

	return router;
}
