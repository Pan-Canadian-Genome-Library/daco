import { StyleSheet, Text } from '@react-pdf/renderer';
import { ReactNode } from 'react';
import { standardStyles } from './standardStyling.ts';

interface TitleProps {
	level?: 'h1' | 'h2';
	children: ReactNode;
}

const styles = StyleSheet.create({
	title: {
		fontFamily: 'LeagueSpartan',
		fontWeight: 'bold',
	},
});

const Title = ({ level = 'h1', children }: TitleProps) => {
	return (
		<Text
			style={{
				...styles.title,
				fontSize: level === 'h1' ? standardStyles.textStyles.sizes.xl : standardStyles.textStyles.sizes.lg,
			}}
		>
			{children}
		</Text>
	);
};

export default Title;
