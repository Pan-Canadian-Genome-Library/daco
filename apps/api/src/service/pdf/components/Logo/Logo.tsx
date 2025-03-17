import { Image } from '@react-pdf/renderer';

const Logo = () => {
	return (
		<Image
			style={{
				width: '40%',
				marginBottom: '14px',
			}}
			src={'./src/service/pdf/components/Logo/pcgl-logo.png'}
		/>
	);
};

export default Logo;
