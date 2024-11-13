import { ConfigProvider, Flex, Image, Layout, Typography } from 'antd';

import PCGLFOOTER from '@/assets/pcgl-logo-footer.png';
import { pcglFooterTheme } from '@/components/providers/ThemeProvider';

const { Footer } = Layout;
const { Text, Link } = Typography;

const linkStyle: React.CSSProperties = {
	textAlign: 'center',
	textWrap: 'nowrap',
};

const textStyle: React.CSSProperties = {
	textAlign: 'center',
};

const FooterComponent = () => {
	return (
		<ConfigProvider theme={pcglFooterTheme}>
			<Footer>
				<Flex justify="center" align="center">
					<Link target="_blank">
						<Image width={200} src={PCGLFOOTER} preview={false} />
					</Link>
					<Flex flex={1} vertical justify="center" align="center" gap={10} wrap>
						<Flex gap={20} justify="center" align="center" wrap>
							<Link style={linkStyle} underline target="_blank">
								Contact Us
							</Link>
							<Link style={linkStyle} underline target="_blank">
								Policies & Guidelines
							</Link>
							<Link style={linkStyle} underline target="_blank">
								Help Guides
							</Link>
							<Link style={linkStyle} underline target="_blank">
								Controlled Data Users
							</Link>
							<Link style={linkStyle} underline target="_blank">
								PCGL Website
							</Link>
							<Link style={linkStyle} underline target="_blank">
								Data Platform
							</Link>
						</Flex>
						<Text style={textStyle}>
							© 2026 PCGL Data Access Compliance Office. All rights reserved. UI v1.0 - API v1.0
						</Text>
						<Flex gap={20} justify="center" align="center">
							<Link style={linkStyle} underline target="_blank">
								Privacy Policy
							</Link>
							<Link style={linkStyle} underline target="_blank">
								Terms & Conditions
							</Link>
							<Link style={linkStyle} underline target="_blank">
								Publication Policy
							</Link>
						</Flex>
					</Flex>
				</Flex>
			</Footer>
		</ConfigProvider>
	);
};

export default FooterComponent;
