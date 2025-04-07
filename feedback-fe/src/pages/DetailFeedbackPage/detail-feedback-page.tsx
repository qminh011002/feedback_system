import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import DetailFeedbackHeader, {
	DetailFeedbackHeaderSkeleton
} from '@/pages/DetailFeedbackPage/components/detail-feedback-header';
import DOMPurify from 'dompurify';
import { MessageSquare, MessageSquareOff } from 'lucide-react';

import FeedbackApis from '@/apis/feedback.apis';
import { Skeleton } from '@/components/ui/skeleton';
import CommentItem from '@/pages/DetailFeedbackPage/components/comment-item';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

export function ContentFeedbackSkeleton() {
	return (
		<div className='px-5'>
			{/* Title Skeleton */}
			<Skeleton className='h-6 w-3/4 mb-4' />

			{/* Content Skeleton */}
			<div className='space-y-3 text-sm text-muted-foreground'>
				<Skeleton className='h-4 w-full' />
				<Skeleton className='h-4 w-[90%]' />
				<Skeleton className='h-4 w-[80%]' />
				<Skeleton className='h-4 w-[70%]' />
			</div>

			{/* Tags Skeleton */}
			<div className='mt-4 flex flex-wrap gap-2'>
				<Skeleton className='h-5 w-16 rounded-full' />
				<Skeleton className='h-5 w-12 rounded-full' />
				<Skeleton className='h-5 w-20 rounded-full' />
			</div>

			{/* Voting Skeleton */}
			<div className='mt-6 flex items-center gap-4'>
				<Skeleton className='h-9 w-24 rounded-md' />
				<Skeleton className='h-9 w-24 rounded-md' />
			</div>
		</div>
	);
}

export function CommentSectionSkeleton() {
	return (
		<div className='px-5'>
			{/* Comment Input Skeleton */}
			<div className='mb-8'>
				<Skeleton className='h-5 w-32 mb-4' />
				<div className='space-y-4'>
					<Skeleton className='h-24 w-full rounded-lg' />
					<div className='flex items-center justify-end'>
						<div className='flex items-center gap-2 mr-4'>
							<Skeleton className='h-4 w-32' />
							<Skeleton className='h-6 w-10 rounded-full' />
						</div>
						<Skeleton className='h-9 w-24 rounded-md' />
					</div>
				</div>
			</div>

			{/* Comment List Skeleton */}
			<div className='space-y-6'>
				{[1, 2, 3].map((_, index) => (
					<div key={index} className='space-y-2'>
						<div className='flex items-center gap-3'>
							<Skeleton className='h-8 w-8 rounded-full' />
							<div className='space-y-1'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-3 w-20' />
							</div>
						</div>
						<Skeleton className='h-4 w-[90%] ml-11' />
						<Skeleton className='h-4 w-[80%] ml-11' />
					</div>
				))}
			</div>
		</div>
	);
}

export default function DetailFeedbackPage() {
	const { id } = useParams();

	const detailFeedback = useQuery({
		queryKey: ['feedback', id],
		queryFn: () => FeedbackApis.prototype.getFeedbackById(id as string),
		staleTime: 6 * 60 * 1000
	});

	const listComment = useQuery({
		queryKey: ['feedback', id, 'comments'],
		queryFn: () => FeedbackApis.prototype.getComentsByFeedbackId(id as string),
		staleTime: 6 * 60 * 1000
	});

	if (detailFeedback.isLoading || listComment.isLoading) {
		return (
			<div>
				<DetailFeedbackHeaderSkeleton />
				<ContentFeedbackSkeleton />
				<CommentSectionSkeleton />
			</div>
		);
	}

	const commentData = listComment.data?.data.data;
	const data = detailFeedback.data?.data.data;

	const contentWithBreaks = data?.content.replace(/\n/g, '<br>');
	const sanitizedContent = DOMPurify.sanitize(contentWithBreaks ?? '', {
		ALLOWED_TAGS: ['br', 'p', 'a', 'ul', 'ol', 'li', 'strong', 'em'] // Liệt kê tất cả thẻ bạn muốn cho phép
	});

	return (
		<div>
			<DetailFeedbackHeader
				status={data?.status}
				img_url={data?.user.avatar}
				author_name={data?.author_name}
				category_name={data?.category_name}
				id={data?.id}
				user_id={data?.user.id}
			/>

			<div className='px-5'>
				{/* Title */}
				<h3 className='text-2xl font-bold tracking-tight mb-4 scroll-m-20'>{data?.title}</h3>

				{/* Content */}
				<div
					className='text-sm text-muted-foreground [&>p]:mb-4 [&>p]:leading-relaxed'
					dangerouslySetInnerHTML={{ __html: sanitizedContent }}
				/>

				{/* Tags */}
				<div className='mt-4 flex flex-wrap gap-2'>
					<span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80'>
						#hashtag
					</span>
				</div>
			</div>
			<Separator className='my-6' />

			<div className='px-5'>
				{/* Comment Input */}
				<div className='mb-8'>
					<h3 className='text-lg font-semibold mb-4'>Comments</h3>
					<form className='space-y-4'>
						<textarea
							disabled={data?.is_comment_disabled}
							placeholder={
								data?.is_comment_disabled
									? 'This feedback no longer accept comment'
									: 'Write your comment...'
							}
							className='w-full disabled:placeholder:italic disabled:cursor-not-allowed px-3 text-[14px]  placeholder:text-[14px] py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-y'
						/>
						<div className='flex items-center justify-end'>
							<div className='flex items-center gap-2 mr-4'>
								<span className='text-sm text-muted-foreground'>Comment with anonymous</span>
								<Switch className='disabled:cursor-not-allowed' disabled={data?.is_comment_disabled} />
							</div>
							<Button disabled={data?.is_comment_disabled} type='submit' className='px-6 '>
								Comment
							</Button>
						</div>
					</form>
				</div>

				{/* Comment List */}
				<div className='space-y-6'>
					{commentData && commentData.length > 0 ? (
						commentData.map((comment) => <CommentItem key={comment.id} data={comment} />)
					) : (
						<div className='flex flex-col items-center justify-center py-12 space-y-4'>
							<MessageSquareOff className='w-12 h-12 text-muted-foreground' />
							<div className='text-center space-y-1'>
								<h3 className='text-lg font-medium'>No comments yet</h3>
								<p className='text-sm text-muted-foreground'>Be the first to share what you think!</p>
							</div>
							<Button variant='outline' className='mt-4'>
								<MessageSquare className='w-4 h-4 mr-2' />
								Add a comment
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
