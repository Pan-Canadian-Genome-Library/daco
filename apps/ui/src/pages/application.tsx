import AppViewerHeader from '@/components/pages/application/AppViewerHeader';
import { Flex, Layout } from 'antd';

const { Content } = Layout;

const ApplicationViewer = () => {
	return (
		<Content>
			<Flex style={{ height: '100%' }} vertical>
				<AppViewerHeader />
			</Flex>
		</Content>
	);
};

export default ApplicationViewer;
