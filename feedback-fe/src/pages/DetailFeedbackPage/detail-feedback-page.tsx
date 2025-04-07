import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import DetailFeedbackHeader, {
	DetailFeedbackHeaderSkeleton
} from '@/pages/DetailFeedbackPage/components/detail-feedback-header';
import DOMPurify from 'dompurify';
import { MessageSquareOff } from 'lucide-react';

import CommentApis from '@/apis/comment.apis';
import FeedbackApis from '@/apis/feedback.apis';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/contexts/app.context';
import CommentItem from '@/pages/DetailFeedbackPage/components/comment-item';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';
import { z } from 'zod';

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

const formCommentSchema = z.object({
	feedback_id: z.string().min(1, 'Feedback ID is required'),
	content: z.string().min(1, 'Content is required'),
	is_anonymous: z.boolean(),
	author_name: z.string().min(1, 'Author name is required'),
	user_id: z.string().min(1, 'User ID is required')
});

export default function DetailFeedbackPage() {
	const { userProfile } = useAppContext();
	const { id } = useParams();

	const form = useForm({
		resolver: zodResolver(formCommentSchema),
		defaultValues: {
			feedback_id: id as string,
			content: '',
			is_anonymous: false,
			author_name: userProfile?.user_name ?? '',
			user_id: userProfile?.id ?? ''
		}
	});

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

	const createComentMutation = useMutation({
		mutationFn: (data: {
			content: string;
			user_id: string;
			feedback_id: string;
			author_name: string;
			is_anonymous: boolean;
		}) => {
			return CommentApis.prototype.createComment(data);
		}
	});

	const hadleSubmitComment = form.handleSubmit(async (data) => {
		try {
			await createComentMutation.mutateAsync({
				user_id: userProfile?.id as string,
				feedback_id: id as string,
				content: data.content,
				author_name: data.author_name,
				is_anonymous: data.is_anonymous
			});

			listComment.refetch();

			form.reset();
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error('Failed to post comment');
		}
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
					<form
						className='space-y-4'
						onSubmit={hadleSubmitComment} // Use proper form submission handler
					>
						<Textarea
							{...form.register('content', {
								required: 'Comment content is required',
								maxLength: {
									value: 1000,
									message: 'Comment cannot exceed 1000 characters'
								}
							})}
							disabled={data?.is_comment_disabled}
							placeholder={
								data?.is_comment_disabled
									? 'This feedback no longer accepts comments'
									: 'Write your comment...'
							}
							className='min-h-[130px] text-[14px] placeholder:text-[14px]'
						/>

						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<Label htmlFor='anonymous-comment' className='text-xs font-normal'>
									Comment anonymously
								</Label>
								<Switch
									id='anonymous-comment'
									checked={form.watch('is_anonymous')}
									onCheckedChange={(checked) => {
										form.setValue('is_anonymous', checked);
										form.setValue(
											'author_name',
											checked ? 'Anonymous' : (userProfile?.user_name ?? '')
										);
									}}
									disabled={data?.is_comment_disabled}
								/>
							</div>

							<Button
								type='submit'
								disabled={data?.is_comment_disabled || form.formState.isSubmitting}
								className='px-6'
							>
								Comment
							</Button>
						</div>
					</form>
				</div>

				{/* Comment List */}
				<div className='px-5'>
					{/* Comment List */}
					<div className='space-y-6 max-h-[500px] pb-7 overflow-y-auto '>
						{/* Thêm max-height và overflow */}
						{commentData && commentData.length > 0 ? (
							commentData.map((comment) => <CommentItem key={comment.id} data={comment} />)
						) : (
							<div className='flex flex-col items-center justify-center py-12 space-y-4'>
								<MessageSquareOff className='w-12 h-12 text-muted-foreground' />
								<div className='text-center space-y-1'>
									<h3 className='text-lg font-medium'>No comments yet</h3>
									<p className='text-sm text-muted-foreground'>
										Be the first to share what you think!
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
