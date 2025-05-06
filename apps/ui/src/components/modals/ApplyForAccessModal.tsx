import { API_PATH_LOGIN } from '@/api/paths';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { Flex, Modal, theme, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { useToken } = theme;
const { Text } = Typography;

interface ApplyForAccessModalProps {
	openModal: boolean;
	setOpenModal: (show: boolean) => void;
}
const ApplyForAccessModal = ({ openModal, setOpenModal }: ApplyForAccessModalProps) => {
	const minWidth = useMinWidth();
	const { t: translate } = useTranslation();
	const { token } = useToken();

	const handleLoginButton = () => {
		setOpenModal(false);
		window.location.href = API_PATH_LOGIN;
	};

	return (
		<Modal
			title={translate('links.apply')}
			okText={translate('button.login')}
			width={'100%'}
			style={{
				top: '20%',
				maxWidth: '800px',
				paddingInline: minWidth <= token.screenSM || minWidth >= token.screenXL ? token.padding : token.paddingXL,
			}}
			open={openModal}
			onOk={handleLoginButton}
			onCancel={() => setOpenModal(false)}
		>
			<Flex>
				<Text>{translate('modals.authorization.description')}</Text>
			</Flex>
		</Modal>
	);
};

export default ApplyForAccessModal;
