import Header from '@/components/header';
import { Outlet } from 'react-router';

export default function MainLayout() {
	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<main className='w-full max-w-[800px] mx-auto px-4 sm:px-6 lg:px-0'>
				<div className='border border-b-0 h-[calc(100vh-64px)] bg-white rounded-tl-4xl rounded-tr-4xl overflow-hidden'>
					<Outlet />
				</div>
			</main>
		</div>
	);
}
