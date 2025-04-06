import { Check, CirclePlus } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SortOptions, Status } from '@/constants/enum';
import { cn } from '@/lib/utils';
import { FeedbackAction, GetModifyType } from '@/pages/FeedbackPage/context/feedback.context';
import { useFeedbackContext } from '@/hooks/useFeedbackContext';

type FilterItem = {
	value: string;
	label: string | React.ReactNode;
};

type Props = {
	data: FilterItem[];
	label?: string;
	filterKey: 'status' | 'category' | 'sortby';
	width?: number;
};

export function FilterCombobox({ data, label, filterKey, width = 100 }: Props) {
	const { state, dispatch } = useFeedbackContext();
	const [open, setOpen] = React.useState(false);

	// Get current value from context based on filterKey
	const currentValue = state[
		filterKey === 'status' ? 'filterStatus' : filterKey === 'category' ? 'filterCategory' : 'sortBy'
	] as string | undefined;

	const selectedItem = data.find((d) => d.value === currentValue);

	const handleSelect = (selectedValue: string) => {
		const actionType = GetModifyType(filterKey) as FeedbackAction['type'];
		const payload = currentValue === selectedValue ? undefined : selectedValue;

		dispatch({
			type: actionType,
			payload: payload as Status | string | SortOptions | undefined
		} as FeedbackAction);

		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='justify-between w-auto text-xs max-h-[32px] border-dashed transition-all duration-150 cursor-pointer'
				>
					<CirclePlus color='black' />
					{label}{' '}
					{selectedItem?.label && (
						<div className='flex items-center'>
							<div className='h-5 w-[0.5px] border-[1px] border-gray-100 mr-2'></div>
							<span className='font-light text-[11px] leading-[11px] p-1.5 rounded bg-[#f4f4f5cc]'>
								{selectedItem.label}
							</span>
						</div>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent style={{ width: `${width}px` }} className='p-0' align='start' side='bottom'>
				<Command>
					<CommandInput placeholder={label} className='h-9' />
					<CommandList>
						<CommandEmpty>No options found.</CommandEmpty>
						<CommandGroup>
							{data.map((item) => (
								<CommandItem key={item.value} value={item.value} onSelect={handleSelect}>
									{item.label}
									<Check
										className={cn(
											'ml-auto',
											currentValue === item.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
