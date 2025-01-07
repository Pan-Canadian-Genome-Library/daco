import StatusBannerWrapper from '@/components/layouts/StatusBarWrapper';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { Col, Flex, Row, theme, Typography } from 'antd';
import { PropsWithChildren } from 'react';

const { Text, Title } = Typography;
const { useToken } = theme;

interface PageHeaderProps extends PropsWithChildren {
	title: string;
	description?: string;
}

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
	const { token } = useToken();
	const minWidth = useMinWidth();
	const responsiveMode = minWidth <= token.screenLG;

	return (
		<StatusBannerWrapper style={!description ? { minHeight: 150 } : { minHeight: 300 }}>
			<Row style={{ width: '100%' }} gutter={token.sizeXXL} wrap>
				<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
					<Flex style={{ height: '100%' }} vertical justify="center" align="start">
						<Title>{title}</Title>
						{description ? <Text>{description}</Text> : null}
					</Flex>
				</Col>
				<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
					<Flex style={{ height: '100%' }} justify={responsiveMode ? 'center' : 'end'} align="center">
						{children ? children : null}
					</Flex>
				</Col>
			</Row>
		</StatusBannerWrapper>
	);
};

export default PageHeader;
