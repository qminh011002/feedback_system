import FeedbackApis from '@/apis/feedback.apis';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination';
import { useFeedbackContext } from '@/hooks/useFeedbackContext';
import AddNewFeedback from '@/pages/FeedbackPage/components/add-new-feedback';
import FeedbackItem, { FeedbackItemSkeleton } from '@/pages/FeedbackPage/components/feedback-item';
import FeedbackPageHeader from '@/pages/FeedbackPage/components/feedback-page-header';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import _, { isUndefined } from 'lodash';
import { MessageCircle } from 'lucide-react';

export interface IQueryParams {
	pageSize: number;
	currentPage: number;
	[otherParams: string]: string | number;
}

const configQueryParams: IQueryParams = {
	pageSize: 7,
	currentPage: 1
};

const RANGE = 2;

export default function FeedbackPage() {
	const { state } = useFeedbackContext();

	const queryParams = {
		...configQueryParams,
		..._.omitBy(state, isUndefined)
	};

	const feedbackListQuery = useQuery({
		queryKey: ['feedbackList', queryParams],
		queryFn: () => FeedbackApis.prototype.getListFeedback(queryParams),
		staleTime: 1000 * 60 * 5,
		placeholderData: keepPreviousData
	});
	const pagination = feedbackListQuery.data?.data.data.pagination;
	const totalPages = pagination?.total_pages || 0;
	const currentPage = pagination?.current_page || 1;

	const handlePageChange = (newPage: number) => {
		if (newPage < 1 || newPage > totalPages) return;
		queryParams.currentPage = newPage;
		feedbackListQuery.refetch();
	};

	const renderPagination = () => {
		if (!totalPages) return null;

		let dotAfter = false;
		let dotBefore = false;
		const pages = [];

		for (let index = 1; index <= totalPages; index++) {
			if (
				index <= RANGE ||
				index > totalPages - RANGE ||
				(index >= currentPage - RANGE && index <= currentPage + RANGE)
			) {
				pages.push(
					<PaginationItem key={index}>
						<PaginationLink onClick={() => handlePageChange(index)} isActive={index === currentPage}>
							{index}
						</PaginationLink>
					</PaginationItem>
				);
			} else {
				if (index < currentPage && !dotBefore) {
					dotBefore = true;
					pages.push(
						<PaginationItem key={`ellipsis-before-${index}`}>
							<PaginationEllipsis />
						</PaginationItem>
					);
				} else if (index > currentPage && !dotAfter) {
					dotAfter = true;
					pages.push(
						<PaginationItem key={`ellipsis-after-${index}`}>
							<PaginationEllipsis />
						</PaginationItem>
					);
				}
			}
		}

		return pages;
	};
	return (
		<div className='relative h-[calc(100vh-64px)] flex flex-col'>
			<FeedbackPageHeader />

			{feedbackListQuery.isLoading ? (
				<div className='flex-1 overflow-y-auto'>
					{Array.from({ length: 10 }, (_, index) => (
						<FeedbackItemSkeleton key={index} />
					))}
				</div>
			) : (
				<div className='flex-1 overflow-y-auto'>
					{feedbackListQuery.data?.data.data.data.length ? (
						feedbackListQuery.data.data.data.data.map((feedback) => (
							<FeedbackItem key={feedback.id} data={feedback} />
						))
					) : (
						<div className='flex flex-col items-center justify-center h-full py-12'>
							<div className='w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4'>
								<MessageCircle className='w-12 h-12 text-muted-foreground' />
							</div>
							<h3 className='text-lg font-medium text-foreground mb-2'>No feedback yet</h3>
							<p className='text-sm text-muted-foreground text-center max-w-md mb-4'>
								Be the first to share your thoughts and suggestions.
							</p>

							<AddNewFeedback />
						</div>
					)}
				</div>
			)}

			{totalPages > 1 && (
				<div className='sticky bottom-0 bg-white py-2 px-4 sm:px-6 border-t'>
					<Pagination className='mx-auto w-fit'>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href='#'
									onClick={() => handlePageChange(currentPage - 1)}
									isActive={currentPage > 1}
								/>
							</PaginationItem>

							{renderPagination()}

							<PaginationItem>
								<PaginationNext
									href='#'
									onClick={() => handlePageChange(currentPage + 1)}
									isActive={currentPage < totalPages}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
