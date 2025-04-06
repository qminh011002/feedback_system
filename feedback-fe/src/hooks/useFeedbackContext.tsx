import { FeedbackContext } from '@/pages/FeedbackPage/context/feedback.context';
import { useContext } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const useFeedbackContext = () => {
	const context = useContext(FeedbackContext);
	if (!context) {
		throw new Error('useFeedbackContext must be used within a FeedbackProvider');
	}
	return context;
};
