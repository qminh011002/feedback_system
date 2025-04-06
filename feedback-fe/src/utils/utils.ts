import { IUser } from '@/types/app.type';

export const saveUserProfileToLocalStorage = (user: IUser) => {
	const _user = JSON.stringify(user);

	localStorage.setItem('user_profile', _user);
};

export const getUserProfileFromLocalStorage = () => {
	const _user = localStorage.getItem('user_profile');

	return _user ? JSON.parse(_user) : null;
};

/**
 * Formats an ISO date string into a human-readable relative time
 * @param isoDate - ISO date string (e.g., "2025-04-04T07:49:54.934Z")
 * @returns A string like "5 months ago", "2 days ago", or full date if too old
 */
export function formatFeedbackTime(isoDate: string): string {
	const date = new Date(isoDate);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime(); // Difference in milliseconds
	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);
	const diffMonths = Math.floor(diffDays / 30); // Approximate months
	const diffYears = Math.floor(diffDays / 365); // Approximate years

	if (diffSeconds < 60) {
		return `${diffSeconds} seconds ago`;
	} else if (diffMinutes < 60) {
		return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
	} else if (diffHours < 24) {
		return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
	} else if (diffDays < 30) {
		return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
	} else if (diffMonths < 12) {
		return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
	} else if (diffYears >= 1) {
		return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
	}

	// Fallback to full date if it's too far in the past or future
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}
