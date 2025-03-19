import { Image, NodeProps } from '@react-pdf/renderer';

const Logo = ({ style }: Pick<NodeProps, 'style'>) => {
	return <Image style={{ ...style }} src={'./src/service/pdf/components/Logo/pcgl-logo.png'} />;
};

export default Logo;
