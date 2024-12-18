import AppViewerStatusBar from '@/components/pages/application/AppViewerStatusBar';
import { Flex, Layout } from 'antd';

const { Content } = Layout;

const ApplicationViewer = () => {
	return (
		<Content>
			<Flex style={{ height: '100%' }} vertical>
				<AppViewerStatusBar />
			</Flex>
		</Content>
	);
};

export default ApplicationViewer;
