import { Badge } from '@/components/ui/badge';

export type FeedbackStatus = 'open' | 'inprogress' | 'closed';

function getStatusDisplay(status: FeedbackStatus) {
	const statusMap: Record<FeedbackStatus, { label: string; className: string }> = {
		open: {
			label: 'Open',
			className:
				'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/50'
		},
		inprogress: {
			label: 'In Progress',
			className:
				'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/50'
		},
		closed: {
			label: 'Closed',
			className:
				'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-800/50'
		}
	};

	return statusMap[status];
}

interface BadgeStatusProps {
	status: FeedbackStatus;
}

export function BadgeStatus({ status }: BadgeStatusProps) {
	const { label, className } = getStatusDisplay(status);

	return (
		<Badge className={`rounded-full text-xs font-medium ${className}`} variant='outline'>
			{label}
		</Badge>
	);
}

// Ví dụ sử dụng (giữ nguyên)
export function FeedbackItem({ data }: { data: { status: FeedbackStatus } }) {
	return (
		<div>
			<BadgeStatus status={data.status} />
		</div>
	);
}
