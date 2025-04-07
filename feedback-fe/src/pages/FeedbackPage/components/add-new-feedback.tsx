// add-new-feedback.tsx
import CategoryApis from '@/apis/category.apis';
import FeedbackApis from '@/apis/feedback.apis';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/contexts/app.context';
import { queryClient } from '@/main';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, MessageCircle, Send, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// (title, content, category_id, user_id,author_name ,status, rating)
const formSchema = z.object({
	title: z.string().min(2, {
		message: 'Title must be at least 2 characters.'
	}),
	category_id: z.string().min(1, {
		message: 'Please select a category.'
	}),
	content: z.string().min(1, {
		message: 'Content cannot be empty.'
	}),
	rating: z.number().min(1, {
		message: 'Please select a rating.'
	}),
	status: z.enum(['open', 'closed', 'inprogress'], {
		required_error: 'Please select a status.'
	}),
	author_name: z.string().optional(),
	is_anonymous: z.boolean(),
	user_id: z.string()
});

export default function AddNewFeedback() {
	const { userProfile } = useAppContext();
	const [isSwitched, setIsSwitched] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [hoverRating, setHoverRating] = useState(0);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			category_id: '',
			content: '',
			rating: 0,
			status: 'open', // Giá trị mặc định,
			author_name: userProfile?.user_name,
			is_anonymous: false,
			user_id: userProfile?.id
		}
	});

	const categoriesQuery = useQuery({
		queryKey: ['categories'],
		queryFn: CategoryApis.prototype.getListCategories,
		staleTime: Infinity
	});

	const createFeedbackMutation = useMutation({
		mutationFn: (body: {
			title: string;
			content: string;
			category_id: string;
			user_id: string;
			author_name: string;
			status: string;
			rating: number;
			is_anonymous: boolean;
		}) => FeedbackApis.prototype.createFeedback(body),
		onSuccess: () => {
			form.reset();
			setIsOpen(false);
		}
	});

	useEffect(() => {
		if (!isOpen) {
			form.reset();
			setHoverRating(0);
		}
	}, [form, isOpen]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const body = {
			...values,
			is_annonymous: isSwitched,
			author_name: isSwitched ? values.author_name : userProfile?.user_name,
			user_id: userProfile?.id as string
		} as unknown as {
			title: string;
			content: string;
			category_id: string;
			author_name: string;
			status: string;
			rating: number;
			is_anonymous: boolean;
			user_id: string;
		};
		console.log(body);
		try {
			await createFeedbackMutation.mutateAsync(body);

			queryClient.refetchQueries({ queryKey: ['feedbackList'] });
		} catch (error) {
			console.error('Error creating feedback:', error);
		}
	}

	const renderStars = () => {
		const hasError = !!form.formState.errors.rating;
		const currentRating = form.getValues('rating');

		return [1, 2, 3, 4, 5].map((star) => {
			const isActive = star <= (hoverRating || currentRating);
			const isHovered = star <= hoverRating;

			return (
				<Star
					key={star}
					strokeWidth={1}
					className={`h-6 w-6 cursor-pointer transition-all duration-200 ${
						isActive
							? hasError && !isHovered
								? 'fill-white stroke-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.3)]'
								: 'fill-yellow-400 stroke-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]'
							: hasError && !isHovered
								? 'fill-red-50 stroke-red-400'
								: 'fill-white stroke-gray-300'
					} ${
						isHovered ? 'fill-yellow-400 stroke-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]' : ''
					}`}
					onMouseEnter={() => setHoverRating(star)}
					onMouseLeave={() => setHoverRating(0)}
					onClick={() => {
						form.setValue('rating', star);
						form.clearErrors('rating');
					}}
				/>
			);
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='gap-2 rounded-[12px] cursor-pointer w-full sm:w-auto'>
					<MessageCircle className='h-4 w-4' />
					<span className='text-sm'>Feedback</span>
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[680px] max-w-[calc(100%-30px)] w-full'>
				<DialogHeader>
					<DialogTitle>Share your feedback</DialogTitle>
					<DialogDescription>Share your thoughts and suggestions to help us improve.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-9'>
						{/* Custom Author Section */}
						<FormField
							control={form.control}
							name='author_name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<div className='flex items-center gap-2'>
											<Input
												disabled={!isSwitched}
												className='w-[200px]'
												placeholder='shadcn'
												{...field}
											/>
											<Switch
												id='is-anonymous'
												onCheckedChange={(checked) => {
													setIsSwitched(checked);

													field.onChange(checked ? 'Anonymous' : userProfile?.user_name);
												}}
												defaultChecked={field.value === 'Anonymous'}
											/>
											<label htmlFor='is-anonymous' className='text-xs italic text-gray-500'>
												Custom to another name 'Anonymous'
											</label>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className='flex flex-col sm:flex-row gap-4 sm:gap-8 items-start mt-3'>
							{/* Category - Fixed width */}
							<FormField
								control={form.control}
								name='category_id'
								render={({ field }) => (
									<FormItem className='w-full sm:w-[200px]'>
										<FormLabel>Category</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className='min-w-[200px] cursor-pointer hover:bg-muted transition-colors'>
													<SelectValue placeholder='Select a category' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categoriesQuery.data?.data.data.map((category) => (
													<SelectItem key={category.id} value={category.id}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							{/* Status - Fixed width */}
							<FormField
								control={form.control}
								name='status'
								render={({ field }) => (
									<FormItem className='w-full sm:w-[180px]'>
										<FormLabel>Status</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className='min-w-[180px] cursor-pointer hover:bg-muted transition-colors'>
													<SelectValue placeholder='Select status' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='open'>Open</SelectItem>
												<SelectItem value='closed'>Closed</SelectItem>
												<SelectItem value='inprogress'>In Progress</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							{/* Rating - Fixed width */}
							<FormField
								control={form.control}
								name='rating'
								render={({ field }) => (
									<FormItem className='w-full sm:w-[200px]'>
										<FormLabel>Rating</FormLabel>
										<FormControl>
											<div className='flex items-center mt-1 gap-1' {...field}>
												{renderStars()}
											</div>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{/* Feedback Content */}
						<FormLabel className='mb-2'>Content of your feedback</FormLabel>
						<div className='space-y-4 py-4 px-3 bg-gray-50 rounded-lg w-full'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder='Enter title here...'
												{...field}
												className='placeholder:font-bold placeholder:text-xl focus-visible:outline-none font-bold text-xl! shadow-none border-none focus-visible:shadow-none focus-visible:border-0 focus-visible:ring-0'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<div className='max-w-[calc(100%-20px)] mx-auto h-[1px] bg-gray-200 my-1'></div>
							<FormField
								control={form.control}
								name='content'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												placeholder='Provide content here...'
												className='h-[250px] overflow-scroll w-full placeholder:italic focus-visible:outline-none shadow-none border-none focus-visible:shadow-none focus-visible:border-0 focus-visible:ring-0'
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<div className='max-w-[calc(100%-20px)] mx-auto h-[1px] bg-gray-200 my-2'></div>
							<Input
								placeholder='Use hashtags with # to separate them'
								className=' focus-visible:outline-none shadow-none text-xs! border-none focus-visible:shadow-none focus-visible:border-0 focus-visible:ring-0'
							/>
						</div>

						<DialogFooter>
							<Button
								type='submit'
								className='w-full cursor-pointer sm:w-auto flex items-center gap-2'
								disabled={createFeedbackMutation.isPending}
							>
								{createFeedbackMutation.isPending ? (
									<>
										<Loader2 className='h-4 w-4 animate-spin' />
										<span>Submitting...</span>
									</>
								) : (
									<>
										<Send />
										<span>Submit Feedback</span>
									</>
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
