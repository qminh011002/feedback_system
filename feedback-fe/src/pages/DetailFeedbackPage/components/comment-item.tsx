import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IComment } from '@/types/app.type';
import { formatFeedbackTime } from '@/utils/utils';
import DOMPurify from 'dompurify';

type Props = {
	data: IComment;
};

export default function CommentItem({ data }: Props) {
	const contentWithBreaks = data.content.replace(/\n/g, '<br>');
	const sanitizedContent = DOMPurify.sanitize(contentWithBreaks, {
		ALLOWED_TAGS: ['br', 'p', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'code']
	});

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((part) => part[0])
			.join('')
			.toUpperCase();
	};

	return (
		<div className='group flex gap-3 p-3 hover:bg-muted/50 transition-colors rounded-lg'>
			<Avatar className='h-9 w-9 mt-0.5'>
				<AvatarImage
					src={data.is_anonymous ? '/public/app/anonymous_avatar.png' : data.imge_url}
					alt={data.author_name}
				/>
				<AvatarFallback className='text-xs font-medium bg-muted'>
					{getInitials(data.author_name)}
				</AvatarFallback>
			</Avatar>

			<div className='flex-1 space-y-1.5'>
				<div className='flex items-center gap-2'>
					<h4 className='text-sm font-semibold'>{data.author_name}</h4>
					<span className='text-xs text-muted-foreground'>{formatFeedbackTime(data.created_at)}</span>
				</div>

				<div
					className='text-sm [&_a]:text-primary [&_a]:underline [&_ul]:my-2 [&_ol]:my-2 [&_li]:pl-1 [&_p]:my-2'
					dangerouslySetInnerHTML={{ __html: sanitizedContent }}
				/>
			</div>
		</div>
	);
}
