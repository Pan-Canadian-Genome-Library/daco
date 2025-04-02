import { useMutation } from '@tanstack/react-query';

import { withErrorResponseHandler } from '@/api/apiUtils';
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';

type SubmitApplicationResponse = {
	success: boolean;
	message: string;
	errors?: string;
};

const useSubmitApplication = (applicationId?: string | number) => {
	const { state, dispatch } = useApplicationContext();

	return useMutation<SubmitApplicationResponse, ServerError>({
		mutationFn: async () => {
			const response = await fetch(`/applications/${applicationId}/submit`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					applicationId: applicationId,
				}),
			}).then(withErrorResponseHandler);

			return await response.json().then((data: SubmitApplicationResponse) => {
				// Update application context if submission is successful
				if (data.message === 'Application submitted successfully.' && data) {
					dispatch({ type: 'UPDATE_APPLICATION', payload: { ...state } });
				}
				return data;
			});
		},
	});
};

export default useSubmitApplication;
