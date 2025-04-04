import { withErrorResponseHandler } from '@/api/apiUtils';
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useMutation } from '@tanstack/react-query';
import { notification } from 'antd';
import { useNavigate } from 'react-router';

type SubmitApplicationResponse = {
	success: boolean;
	message: string;
	errors?: string;
};

const useSubmitApplication = (applicationId?: string | number) => {
	const { state, dispatch } = useApplicationContext(); // Access context
	const navigation = useNavigate();

	return useMutation<SubmitApplicationResponse, ServerError, { applicationId?: string | number }>({
		mutationFn: async ({ applicationId }) => {
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
				// Check if submission was successful and update the application status in context
				if (data.success && data.message === 'Application submitted successfully.') {
					dispatch({
						type: 'UPDATE_APPLICATION', // Update the context state
						payload: {
							...state,
							applicationStatus: 'submitted', // Set applicationStatus to 'submitted'
						},
					});
				}
				return data;
			});
		},
		onSuccess: (data) => {
			notification.success({
				message: 'Application has been submitted succesfully',
			});
			navigation(`/dashboard`);
		},
		onError: (error) => {
			// Handle error UI (e.g., show error notification)
			console.error(error);
			notification.error({
				message: 'Application cannot be submitted',
			});
		},
	});
};

export default useSubmitApplication;
