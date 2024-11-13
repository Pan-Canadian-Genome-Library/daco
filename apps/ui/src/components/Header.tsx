import { Button, ConfigProvider, Flex, Image, Layout, Typography } from 'antd';

import PCGL from '@/assets/pcgl-logo-full.png';

import { pcglHeaderTheme } from './providers/ThemeProvider';

const { Link } = Typography;
const { Header } = Layout;

const linkStyle: React.CSSProperties = {
	minWidth: 100,
	textAlign: 'center',
};

const HeaderComponent = () => {
	return (
		<ConfigProvider theme={pcglHeaderTheme}>
			<Header>
				<Flex style={{ height: '100%' }} justify="center" align="center" gap={40}>
					<Flex flex={1}>
						<Flex justify="space-around" align="center" gap={40}>
							<Link target="_blank">
								<Image width={200} src={PCGL} preview={false} />
							</Link>
							<Link style={linkStyle} target="_blank">
								Policies & Guidelines
							</Link>
							<Link style={linkStyle} target="_blank">
								Help Guides
							</Link>
							<Link style={linkStyle} target="_blank">
								Controlled Data Users
							</Link>
						</Flex>
					</Flex>
					<Flex justify="flex-end" align="center" gap={20}>
						<Link style={linkStyle} target="_blank">
							Apply For Access
						</Link>
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
