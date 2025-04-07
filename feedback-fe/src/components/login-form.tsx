import { CloudCog, MessageSquareText } from 'lucide-react';

import AuthenticationApi from '@/apis/auth.apis';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/contexts/app.context';
import { cn } from '@/lib/utils';
import { saveUserProfileToLocalStorage } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
	email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
	password: z
		.string()
		.min(1, { message: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
});

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
	const { setIsAuth, setUserProfile } = useAppContext();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const loginMutation = useMutation({
		mutationFn: AuthenticationApi.prototype.login
	});

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			const result = await loginMutation.mutateAsync(data);

			setIsAuth(true);
			setUserProfile(result.data.data);
			localStorage.setItem('isAuth', 'true');
			saveUserProfileToLocalStorage(result.data.data);
			toast.success('Login successful');
		} catch (error) {
			form.setError('password', {
				message: 'Email or password is incorrect !'
			});
		}
	});

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Form {...form}>
				<form onSubmit={onSubmit} className='space-y-8'>
					<div className='flex flex-col items-center gap-2'>
						<a href='#' className='flex flex-col items-center gap-2 font-medium'>
							<div className='flex h-8 w-8 items-center justify-center rounded-md'>
								<MessageSquareText className='size-6' />
							</div>
						</a>
						<h1 className='text-xl font-bold'>Feedback system</h1>
					</div>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input {...field} placeholder='m@example.com' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input placeholder='Enter your password' type='password' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit' className='w-full py-3 cursor-pointer'>
						Login
					</Button>
				</form>
			</Form>
		</div>
	);
}
