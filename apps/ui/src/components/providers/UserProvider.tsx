import type { UserResponse } from '@pcgl-daco/validation';
import { createContext, useContext, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import useGetUser from '../../api/useGetUser';

// type WithFetching<T extends object> =
// 	| ({ state: 'success' } & T)
// 	| { state: 'fetching' }
// 	| ({ state: 'error' } & ServerError);

type UserState = {
	isLoading: boolean;
	isLoggedIn: boolean;
	refresh: () => void;
} & Partial<UserResponse>;

const UserContext = createContext<UserState>({ isLoading: true, isLoggedIn: false, refresh: () => {} });

export function UserProvider({ children }: PropsWithChildren) {
	const { t: translate } = useTranslation();
	const { data, error, isLoading, refetch } = useGetUser();

	// TODO: update local storage

	// const value: WithFetching<UserResponse> = isLoading
	// 	? { state: 'fetching' }
	// 	: error
	// 		? { state: 'error', ...error }
	// 		: data
	// 			? { state: 'success', ...data }
	// 			: { state: 'error', message: translate('errors.generic.title'), errors: translate('errors.generic.message') };

	const refresh = () => {
		// TODO: update local storage
		refetch();
	};

	const value: UserState = {
		...data,
		isLoading,
		isLoggedIn: isLoading ? false : data ? data.role !== 'ANONYMOUS' : false,
		refresh,
	};
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useCount must be used within a CountProvider');
	}
	return context;
}
