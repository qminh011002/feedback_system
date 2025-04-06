import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronRight, MoreHorizontal, Trash } from 'lucide-react';

export default function DetailFeedbackHeader() {
	return (
		<div className='p-5'>
			<div className='flex justify-between items-center'>
				<div className='flex items-center gap-2'>
					<Avatar className='w-8.5 h-8.5'>
						<AvatarImage src='https://github.com/shadcn.png' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>

					<h3 className='font-semibold text-[15px]'>Name</h3>

					<ChevronRight size={20} color='gray' />

					<h3 className='font-semibold text-[15px]'>Service</h3>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<MoreHorizontal className='cursor-pointer' size={18} />
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-40'>
						<DropdownMenuGroup>
							<DropdownMenuItem>
								Profile
								<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>Team</DropdownMenuItem>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>Set status</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuItem>Open</DropdownMenuItem>
										<DropdownMenuItem>In Progress</DropdownMenuItem>
										<DropdownMenuItem>Closed</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant='destructive' className='flex justify-between'>
							<span>Delete</span>
							<Trash />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
