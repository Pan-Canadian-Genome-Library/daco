import { Button, ConfigProvider, Flex, Layout, Typography } from 'antd';
import { pcglHeaderTheme } from './providers/ThemeProvider';
const { Link } = Typography;
const { Header } = Layout;

const HeaderComponent = () => {
	return (
		<ConfigProvider theme={pcglHeaderTheme}>
			<Header>
				<Flex style={{ height: '100%' }} justify="center" align="center">
					<Flex flex={1}>
						<Flex justify="space-around" align="center" gap={30}>
							<Link target="_blank">Policies & Guidelines</Link>
							<Link target="_blank">Help Guides</Link>
							<Link target="_blank">Controlled Data Users</Link>
						</Flex>
					</Flex>
					<Flex justify="flex-end" align="center" gap={20}>
						<Link target="_blank">Apply For Access</Link>
						<Button variant="solid" color="primary">
							Login
						</Button>
					</Flex>
				</Flex>
			</Header>
		</ConfigProvider>
	);
};

export default HeaderComponent;
