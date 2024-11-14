import { ConfigProvider, Flex, Image, Layout, Typography } from 'antd';

import PCGLFOOTER from '@/assets/pcgl-logo-footer.png';
import { pcglFooterTheme } from '@/components/providers/ThemeProvider';

const { Footer } = Layout;
const { Text, Link } = Typography;

interface LinkType {
	name: string;
	href?: string;
}

const pcglLinks: LinkType[] = [
	{
		name: 'Contact Us',
	},
	{
		name: 'Policies & Guidelines',
	},
	{
		name: 'Help Guides',
	},
	{
		name: 'Controlled Data Users',
	},
	{
		name: 'PCGL Website',
	},
	{
		name: 'Data Platform',
	},
];

const policiesConditionsLinks: LinkType[] = [
	{
		name: 'Privacy Policy',
	},
	{
		name: 'Terms & Conditions',
	},
	{
		name: 'Publication Policy',
	},
];

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
							{pcglLinks.map((itemLink) => (
								<Link style={linkStyle} underline target="_blank">
									{itemLink.name}
								</Link>
							))}
						</Flex>
						<Text style={textStyle}>
							© 2026 PCGL Data Access Compliance Office. All rights reserved. UI v1.0 - API v1.0
						</Text>
						<Flex gap={20} justify="center" align="center">
							{policiesConditionsLinks.map((itemLink) => (
								<Link style={linkStyle} underline target="_blank">
									{itemLink.name}
								</Link>
							))}
						</Flex>
					</Flex>
				</Flex>
			</Footer>
		</ConfigProvider>
	);
};

export default FooterComponent;
