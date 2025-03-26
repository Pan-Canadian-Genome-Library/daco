import { StyleSheet, Text } from '@react-pdf/renderer';
import { ReactNode } from 'react';
import { standardStyles } from './standardStyling.ts';

const styles = StyleSheet.create({
	paragraph: {
		fontFamily: 'OpenSans',
		fontWeight: 'normal',
		lineHeight: '1rem',
		fontSize: standardStyles.textStyles.sizes.md,
	},
});
const Paragraph = ({ children, notice }: { children: ReactNode; notice?: boolean }) => {
	return (
		<Text style={{ ...styles.paragraph, color: notice ? standardStyles.colours.primary : '#000' }}>{children}</Text>
	);
};

export default Paragraph;
