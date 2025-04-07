import FeedbackApis from '@/apis/feedback.apis';
import { queryClient } from '@/App';
import { BadgeStatus, FeedbackStatus } from '@/components/bagde-status';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppContext } from '@/contexts/app.context';
import { useMutation } from '@tanstack/react-query';
import { ChevronRight, MoreHorizontal, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

type Props = {
	status?: string;
	img_url?: string;
	author_name?: string;
	category_name?: string;
	id?: string;
	user_id?: string;
	is_anonymous?: boolean;
};

export function DetailFeedbackHeaderSkeleton() {
	return (
		<div className='p-5'>
			<div className='flex justify-between items-center'>
				<div className='flex items-center gap-2'>
					<Skeleton className='w-8.5 h-8.5 rounded-full' />

					<Skeleton className='h-4 w-20 rounded' />

					<ChevronRight size={20} color='gray' />

					<Skeleton className='h-4 w-20 rounded' />
				</div>
				<Skeleton className='w-6 h-6 rounded-md' />
			</div>
		</div>
	);
}
export default function DetailFeedbackHeader({
	author_name,
	category_name,
	id,
	img_url,
	user_id,
	status: _status,
	is_anonymous
}: Props) {
	const { userProfile } = useAppContext();
	const navigate = useNavigate();

	const updateStatusMutation = useMutation({
		mutationFn: (data: { id: string; status: string }) => {
			return FeedbackApis.prototype.updateStatusFeedback(data.id, data.status);
		}
	});

	const deleteFeedbackMutation = useMutation({
		mutationFn: (id: string) => {
			return FeedbackApis.prototype.deleteFeedback(id);
		}
	});

	const handleDeleteFeedback = async () => {
		if (!id) return;
		try {
			await deleteFeedbackMutation.mutateAsync(id);
			queryClient.invalidateQueries({ queryKey: ['feedbackList'] });

			toast.success('Delete feedback successfully');
			navigate('/');
		} catch (error) {
			console.error('Error deleting feedback:', error);
		}
	};

	const handleUpdateStatus = async (status: 'open' | 'closed' | 'inprogress') => {
		if (status === _status) return;
		try {
			const result = await updateStatusMutation.mutateAsync({
				id: id as string,
				status
			});

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			queryClient.setQueryData(['feedback', id], (oldData: any) => {
				if (oldData) {
					return {
						...oldData,
						data: {
							...oldData.data,
							data: {
								...oldData.data.data,
								is_comment_disabled: result.data.data.is_comment_disabled,
								status
							}
						}
					};
				}
				return oldData;
			});
		} catch (error) {
			console.error('Error updating status:', error);
		}
	};

	return (
		<div className='p-5'>
			<div className='flex justify-between items-center'>
				<div className='flex items-center gap-2'>
					<Avatar className='w-8.5 h-8.5'>
						<AvatarImage src={is_anonymous ? '/public/app/anonymous_avatar.png' : img_url} />
						<AvatarFallback>{is_anonymous ? 'AN' : author_name?.slice(0, 2)}</AvatarFallback>
					</Avatar>

					<h3 className='font-semibold text-[14px]'>{author_name}</h3>

					<ChevronRight size={20} color='gray' />

					<h3 className='font-semibold text-[14px]'>{category_name}</h3>

					<BadgeStatus status={_status as FeedbackStatus} />
				</div>
				{userProfile?.id === user_id && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<MoreHorizontal className='cursor-pointer' size={18} />
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-40'>
							<DropdownMenuGroup>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>Set status</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuItem onClick={() => handleUpdateStatus('open')}>
												Open
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => handleUpdateStatus('inprogress')}>
												In Progress
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => handleUpdateStatus('closed')}>
												Closed
											</DropdownMenuItem>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<DropdownMenuItem
										variant='destructive'
										onSelect={(e) => e.preventDefault()}
										className='flex justify-between'
									>
										<span>Delete</span>
										<Trash />
									</DropdownMenuItem>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete your feedback and
											remove your data from our servers.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={handleDeleteFeedback}>Continue</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	);
}
