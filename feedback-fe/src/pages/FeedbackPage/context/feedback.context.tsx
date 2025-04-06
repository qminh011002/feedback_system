import { SortOptions, Status } from '@/constants/enum';
import { createContext, Dispatch, useContext, useReducer } from 'react';

interface FeedbackState {
	filterStatus?: Status;
	filterCategory?: string;
	sortBy?: SortOptions;
}

export type FeedbackAction =
	| { type: 'MODIFY_STATUS'; payload: Status }
	| { type: 'MODIFY_CATEGORY'; payload: string }
	| { type: 'MODIFY_SORT'; payload: SortOptions }
	| { type: 'RESET_FILTERS'; payload: string };

export const GetModifyType = (type: 'status' | 'category' | 'sortby'): FeedbackAction['type'] => {
	switch (type) {
		case 'status':
			return 'MODIFY_STATUS';
		case 'category':
			return 'MODIFY_CATEGORY';
		case 'sortby':
			return 'MODIFY_SORT';
		default:
			throw new Error(`Unknown type: ${type}`);
	}
};

const initialState: FeedbackState = {
	filterCategory: undefined,
	sortBy: undefined,
	filterStatus: undefined
};

const reducer = (state: FeedbackState, action: FeedbackAction): FeedbackState => {
	switch (action.type) {
		case 'MODIFY_STATUS':
			return { ...state, filterStatus: action.payload };
		case 'MODIFY_CATEGORY':
			return { ...state, filterCategory: action.payload };
		case 'MODIFY_SORT':
			return { ...state, sortBy: action.payload };
		case 'RESET_FILTERS':
			return initialState;
		default:
			return state;
	}
};

interface FeedbackContextValue {
	state: FeedbackState;
	dispatch: Dispatch<FeedbackAction>;
}

export const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined);

export const FeedbackContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return <FeedbackContext.Provider value={{ state, dispatch }}>{children}</FeedbackContext.Provider>;
};
