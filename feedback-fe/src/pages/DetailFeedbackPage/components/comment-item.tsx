import { IComment } from '@/types/app.type';
import { formatFeedbackTime } from '@/utils/utils';
import DOMPurify from 'dompurify';
type Props = {
	data: IComment;
};

export default function CommentItem({ data }: Props) {
	const contentWithBreaks = data.content.replace(/\n/g, '<br>');
	const sanitizedContent = DOMPurify.sanitize(contentWithBreaks, {
		ALLOWED_TAGS: ['br', 'p', 'a', 'ul', 'ol', 'li', 'strong', 'em'] // Liệt kê tất cả thẻ bạn muốn cho phép
	});
	return (
		<div className='space-y-2'>
			<div className='flex items-center gap-3'>
				<div className='h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center'>
					<span className='text-sm font-medium text-gray-600'>TN</span>
				</div>
				<div>
					<h4 className='font-medium'>{data.author_name}</h4>
					<p className='text-sm text-muted-foreground'>{formatFeedbackTime(data.created_at)}</p>
				</div>
			</div>
			<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
		</div>
	);
}
