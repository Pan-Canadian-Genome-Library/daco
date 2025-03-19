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
const Paragraph = ({ children }: { children: ReactNode }) => {
	return <Text style={styles.paragraph}>{children}</Text>;
};

export default Paragraph;
