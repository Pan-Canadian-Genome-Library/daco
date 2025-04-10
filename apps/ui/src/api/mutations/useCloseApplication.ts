import { withErrorResponseHandler } from '@/api/apiUtils';
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useNotificationContext } from '@/providers/context/notification/NotificationContext';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

type CloseApplicationResponse = {
	success: boolean;
	message: string;
	data: {
		id: number;
		status: string;
	};
};

const useCloseApplication = () => {
	useApplicationContext();
	const notification = useNotificationContext();
	const { t: translate } = useTranslation();
	const navigate = useNavigate();

	return useMutation<CloseApplicationResponse, ServerError, { applicationId?: string | number }>({
		mutationFn: async ({ applicationId }) => {
			const response = await fetch(`/applications/${applicationId}/close`, {
				method: 'POST',
			}).then(withErrorResponseHandler);

			return await response.json();
		},
		onSuccess: (data) => {
			notification.openNotification({
				type: 'success',
				message: translate('closeApplicationSuccess'),
			});
			navigate('/dashboard');
		},
		onError: (error) => {
			notification.openNotification({
				type: 'error',
				message: translate('closeApplicationFailed'),
			});
		},
	});
};

export default useCloseApplication;
