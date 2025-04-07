import { BadgeStatus, FeedbackStatus } from '@/components/bagde-status';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { IFeedback } from '@/types/app.type';
import { formatFeedbackTime } from '@/utils/utils';
import { MessagesSquare, Star } from 'lucide-react';
import { Link } from 'react-router';

export function FeedbackItemSkeleton() {
	return (
		<div className='px-4 sm:px-6 py-6 flex flex-col sm:flex-row border-b gap-4 sm:gap-0 animate-pulse'>
			{/* Vote section */}
			<div className='w-full sm:w-[10%] shrink-0 flex justify-center sm:justify-start gap-2 sm:gap-0'>
				<div className='flex flex-col items-center justify-center p-2'>
					<div className='h-6 w-12 bg-muted rounded mb-2' />
					<div className='h-3 w-10 bg-muted rounded' />
				</div>
			</div>

			{/* Content section */}
			<div className='w-full sm:w-[90%] flex flex-col gap-3 sm:gap-2'>
				<div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-2'>
					{/* Title skeleton */}
					<div className='flex-1 min-w-[200px] max-w-full'>
						<div className='h-5 w-3/4 bg-muted rounded' />
					</div>

					{/* Badges skeleton */}
					<div className='flex flex-shrink-0 items-center gap-2 sm:gap-3'>
						<div className='h-6 w-12 bg-muted rounded-full' />
						<div className='h-6 w-24 bg-muted rounded-full' />
						<div className='h-6 w-16 bg-muted rounded-full' />
					</div>
				</div>

				{/* Description skeleton */}
				<div className='relative max-w-full sm:max-w-[80%]'>
					<div className='h-4 w-full bg-muted rounded' />
				</div>

				{/* Metadata skeleton */}
				<div className='flex flex-wrap items-center justify-between gap-2 pt-1'>
					{/* Hashtags skeleton */}
					<div className='flex gap-2'>
						<div className='h-3 w-20 bg-muted rounded' />
						<div className='h-3 w-16 bg-muted rounded' />
					</div>

					{/* Author info skeleton */}
					<div className='flex items-center gap-2'>
						<div className='h-3 w-16 bg-muted rounded' />
						<div className='h-3 w-1 bg-muted rounded' />
						<div className='flex items-center gap-1'>
							<div className='h-4 w-4 bg-muted rounded-full' />
							<div className='h-3 w-20 bg-muted rounded' />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

type Props = {
	data: IFeedback;
};

export default function FeedbackItem({ data }: Props) {
	return (
		<Link
			to={`/feedback/${data.id}`}
			className='px-4 sm:px-6 py-6 flex flex-col sm:flex-row border-b  gap-4 sm:gap-0 hover:bg-muted/50 transition-colors'
		>
			{/* Content section */}
			<div className='w-full sm:w-full flex flex-col gap-3 sm:gap-2'>
				<div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-2'>
					{/* Title - sẽ tự động xuống dòng khi cần */}
					<h2 className='font-semibold text-base sm:text-lg leading-tight break-words flex-1 min-w-[200px] max-w-full'>
						{data.title}
					</h2>

					{/* Badges - luôn giữ nguyên trên 1 hàng */}
					<div className='flex flex-shrink-0 items-center gap-1 sm:gap-3'>
						<Badge
							className='rounded-full whitespace-nowrap 
			bg-gray-100 text-gray-800 hover:bg-gray-200 
			dark:bg-gray-900/50 dark:text-sky-200 dark:hover:bg-gray-900/70
			border border-gray-200 dark:border-gray-800'
						>
							<Star className='h-3 w-3' fill='#facc15' stroke='#eab308' />
							<span className='text-xs font-bold'>{data.rating}</span>
						</Badge>
						<Badge
							className='rounded-full whitespace-nowrap 
			bg-gray-100 text-gray-800 hover:bg-gray-200 
			dark:bg-gray-900/50 dark:text-sky-200 dark:hover:bg-gray-900/70
			border border-gray-200 dark:border-gray-800'
						>
							<MessagesSquare className='h-3 w-3' />
							<span className='text-xs font-bold'>{data.comment_count}</span>
						</Badge>
						<Badge
							className='rounded-full whitespace-nowrap 
			bg-sky-100 text-sky-800 hover:bg-sky-200 
			dark:bg-sky-900/50 dark:text-sky-200 dark:hover:bg-sky-900/70
			border border-sky-200 dark:border-sky-800'
						>
							{data.category_name}
						</Badge>
						<BadgeStatus status={data.status as FeedbackStatus} />
					</div>
				</div>

				<div className='relative max-w-full sm:max-w-[80%] text-sm overflow-hidden'>
					<div className='line-clamp-1 text-muted-foreground'>
						{data.content.length > 100 ? `${data.content.slice(0, 100)}...` : data.content}
					</div>
				</div>

				{/* Metadata row */}
				<div className='flex flex-wrap items-center justify-between gap-2 pt-1'>
					{/* Hashtags */}
					<div className='flex gap-2 text-xs'>
						<span className='text-muted-foreground'>#permissions</span>
						<span className='text-muted-foreground'>#settings</span>
					</div>

					{/* Author info - Fixed layout */}
					<div className='flex items-center gap-1 text-xs text-muted-foreground'>
						<span>{formatFeedbackTime(data.created_at)}</span>
						<span>•</span>
						<div className='flex items-center gap-1'>
							<span>by</span>
							{data.is_anonymous ? (
								<Avatar className='h-4 w-4'>
									<AvatarImage src='./public/app/anonymous_avatar.png' />
									<AvatarFallback>{data.user.username.slice(0, 2)}</AvatarFallback>
								</Avatar>
							) : (
								<Avatar className='h-4 w-4'>
									<AvatarImage src={data.user.avatar} />
									<AvatarFallback>{data.user.username.slice(0, 2)}</AvatarFallback>
								</Avatar>
							)}
							<span className='font-medium'>{data.author_name}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
