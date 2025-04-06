import CategoryApis from '@/apis/category.apis';
import AddNewFeedback from '@/pages/FeedbackPage/components/add-new-feedback';
import { FilterCombobox } from '@/pages/FeedbackPage/components/filter-combobox';
import { useQuery } from '@tanstack/react-query';
import { JSX } from 'react';

const status = [
	{
		value: 'open',
		label: 'Open'
	},
	{
		value: 'inprogress',
		label: 'In Progress'
	},
	{
		value: 'closed',
		label: 'Closed'
	}
];

const sort_by: { value: string; label: string | JSX.Element }[] = [
	{
		value: 'newest',
		label: 'Newest'
	},
	{
		value: 'oldest',
		label: 'Oldest'
	},
	{
		value: 'mostvote',
		label: 'Most Vote'
	},
	{
		value: 'lessvote',
		label: 'Less Vote'
	},
	{
		value: 'mostcomment',
		label: 'Most Comment'
	},
	{
		value: 'lesscomment',
		label: 'Less Comment'
	},
	{
		value: 'mostrating',
		label: 'Most Rating'
	},
	{
		value: 'leastrating',
		label: 'Least Rating'
	}
];
export function FilterSectionSkeleton() {
	return (
		<div className='p-5 border-b flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 animate-pulse'>
			{/* Filters section */}
			<div className='flex flex-col sm:flex-row gap-3 sm:gap-3 sm:flex-nowrap w-full sm:w-auto'>
				{/* Status Filter Skeleton */}
				<div className='flex flex-col gap-1 w-full sm:w-auto'>
					<div className='h-3 w-12 bg-muted rounded' />
					<div className='h-9 w-[150px] bg-muted rounded' />
				</div>

				{/* Category Filter Skeleton */}
				<div className='flex flex-col gap-1 w-full sm:w-auto'>
					<div className='h-3 w-16 bg-muted rounded' />
					<div className='h-9 w-[200px] bg-muted rounded' />
				</div>

				{/* Sort by Filter Skeleton */}
				<div className='flex flex-col gap-1 w-full sm:w-auto'>
					<div className='h-3 w-14 bg-muted rounded' />
					<div className='h-9 w-[150px] bg-muted rounded' />
				</div>
			</div>

			{/* Add New Feedback button Skeleton */}
			<div className='w-full sm:w-auto'>
				<div className='h-9 w-full sm:w-32 bg-muted rounded' />
			</div>
		</div>
	);
}

export default function FeedbackPageHeader() {
	const categoriesQuery = useQuery({
		queryKey: ['categories'],
		queryFn: CategoryApis.prototype.getListCategories,
		staleTime: Infinity
	});

	if (categoriesQuery.isLoading) return <FilterSectionSkeleton />;

	const categoryFilters = categoriesQuery.data?.data.data.map((c) => ({
		value: c.id,
		label: c.name
	}));

	return (
		<div className='p-5 border-b flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4'>
			{/* Filters section */}
			<div className='flex flex-col sm:flex-row gap-3 sm:gap-3 sm:flex-nowrap w-full sm:w-auto'>
				{/* Status Filter */}
				<div className='flex flex-col gap-1 w-full sm:w-auto'>
					<span className='text-xs text-gray-400 font-medium'>Status</span>
					<FilterCombobox width={150} data={status} label='Status' filterKey='status' />
				</div>

				{/* Category Filter */}
				<div className='flex flex-col gap-1 w-full sm:w-auto'>
					<span className='text-xs text-gray-400 font-medium'>Category</span>
					<FilterCombobox width={200} data={categoryFilters ?? []} label='Category' filterKey='category' />
				</div>

				{/* Sort by Filter */}
				<div className='flex flex-col gap-1 w-full sm:w-auto'>
					<span className='text-xs text-gray-400 font-medium'>Sort by</span>
					<FilterCombobox width={150} data={sort_by} label='Sort by' filterKey='sortby' />
				</div>
			</div>

			{/* Add New Feedback button */}
			<div className='w-full sm:w-auto'>
				<AddNewFeedback />
			</div>
		</div>
	);
}
