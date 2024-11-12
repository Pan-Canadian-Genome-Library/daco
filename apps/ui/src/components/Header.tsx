import { Button, ConfigProvider, Flex, Image, Layout, Typography } from 'antd';
import { pcglHeaderTheme } from './providers/ThemeProvider';
const { Link } = Typography;
const { Header } = Layout;

const imageStyle: React.CSSProperties = {
	width: '100%',
	maxWidth: 200,
	minWidth: 170,
};

const linkStyle: React.CSSProperties = {
	minWidth: 100,
	textAlign: 'center',
};

const HeaderComponent = () => {
	return (
		<ConfigProvider theme={pcglHeaderTheme}>
			<Header>
				<Flex style={{ height: '100%' }} justify="center" align="center">
					<Flex flex={1}>
						<Flex justify="space-around" align="center" gap={40}>
							<Link target="_blank">
								<Image style={imageStyle} src="../../public/pcgl-logo-full.png" preview={false} />
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
