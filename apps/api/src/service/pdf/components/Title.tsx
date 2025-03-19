import { StyleSheet, Text } from '@react-pdf/renderer';
import { ReactNode } from 'react';
import { standardStyles } from './standardStyling.ts';

const styles = StyleSheet.create({
	title: {
		fontFamily: 'LeagueSpartan',
		fontWeight: 'bold',
		fontSize: standardStyles.textStyles.sizes.lg,
	},
});

const Title = ({ children }: { children: ReactNode }) => {
	return <Text style={styles.title}>{children}</Text>;
};

export default Title;
