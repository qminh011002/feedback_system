import { IUser } from '@/types/app.type';
import { getUserProfileFromLocalStorage } from '@/utils/utils';
import { createContext, useContext, useState } from 'react';

interface IAppContext {
	isAuth: boolean;
	userProfile: IUser | null;
	setIsAuth: (value: boolean) => void;
	setUserProfile: (value: IUser | null) => void;
}

const initialAppContext: IAppContext = {
	isAuth: Boolean(localStorage.getItem('isAuth')),
	userProfile: getUserProfileFromLocalStorage(),
	setIsAuth: () => {},
	setUserProfile: () => {}
};
const AppContext = createContext<IAppContext>(initialAppContext);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
	const context = useContext(AppContext); // Fixed case sensitivity
	return context;
};

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuth, setIsAuth] = useState<boolean>(initialAppContext.isAuth);
	const [userProfile, setUserProfile] = useState<IUser | null>(initialAppContext.userProfile);

	return <AppContext value={{ isAuth, userProfile, setIsAuth, setUserProfile }}>{children}</AppContext>;
};
