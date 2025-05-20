import { QueryClient } from '@tanstack/react-query';

import { defaultOnError, defaultOnSuccess } from './mutation';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchInterval: false,
			refetchIntervalInBackground: false,
		},
		mutations: {
			onSuccess: defaultOnSuccess,
			onError: defaultOnError,
		},
	},
});
