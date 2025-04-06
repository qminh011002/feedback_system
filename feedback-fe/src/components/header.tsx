import { Link, useLocation } from 'react-router';
import { MessageSquareText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAppContext } from '@/contexts/app.context';

export default function Header() {
	const { setIsAuth, setUserProfile, userProfile } = useAppContext();
	const location = useLocation();

	const isDetailFeedback = location.pathname.startsWith('/feedback');

	const handeLogout = () => {
		localStorage.clear();
		setIsAuth(false);
		setUserProfile(null);
	};

	return (
		<header>
			<div className='py-4 flex items-center justify-between min-h-[64px] max-w-[calc(100%-50px)] mx-auto'>
				{/* Logo */}
				<Link to='/'>
					<MessageSquareText
						strokeWidth={1.5}
						size={30}
						className='transition-transform hover:scale-105 duration-200'
					/>
				</Link>
				{/* Header title */}
				<div className='h-8 flex items-center justify-center'>
					{isDetailFeedback ? (
						<div>
							<div className='font-semibold text-[15px]'>Detail feedback</div>
							<div className='text-xs text-center text-gray-400'>32 votes</div>
						</div>
					) : (
						<div className='font-semibold text-[15px]'>Feedback</div>
					)}
				</div>
				{/* Cta */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar className='cursor-pointer'>
							<AvatarImage src={userProfile?.imge_url} alt='@shadcn' />
							<AvatarFallback>{userProfile?.user_name.slice(0, 2)}</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent side='bottom' className='absolute -right-5'>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handeLogout}>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
