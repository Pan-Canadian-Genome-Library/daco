import { ConfigProvider, Flex, Layout, Typography } from 'antd';

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
				<Flex>
					<div></div>
					<Flex flex={1} vertical justify="center" align="center" gap={10}>
						<Flex gap={20} justify="center" align="center" wrap>
							<Link style={linkStyle} underline>
								Contact Us
							</Link>
							<Link style={linkStyle} underline>
								Policies & Guidelines
							</Link>
							<Link style={linkStyle} underline>
								Help Guides
							</Link>
							<Link style={linkStyle} underline>
								Controlled Data Users
							</Link>
							<Link style={linkStyle} underline>
								PCGL Website
							</Link>
							<Link style={linkStyle} underline>
								Data Platform
							</Link>
						</Flex>
						<Text style={textStyle}>
							© 2026 PCGL Data Access Compliance Office. All rights reserved. UI v1.0 - API v1.0
						</Text>
						<Flex gap={20} justify="center" align="center">
							<Link style={linkStyle} underline>
								Privacy Policy
							</Link>
							<Link style={linkStyle} underline>
								Terms & Conditions
							</Link>
							<Link style={linkStyle} underline>
								Publication Policy
							</Link>
						</Flex>
					</Flex>
				</Flex>
			</Footer>
			;
		</ConfigProvider>
	);
};

export default FooterComponent;
