import { StyleSheet, View } from '@react-pdf/renderer';
import { ReactNode } from 'react';
import Title from './Title.tsx';
import { standardStyles } from './standardStyling.ts';

interface FormDisplay {
	title: string;
	children: ReactNode;
}

const styles = StyleSheet.create({
	form: {
		marginTop: standardStyles.textStyles.sizes.xl,
		gap: standardStyles.textStyles.sizes.lg,
		display: 'flex',
		flexDirection: 'column',
	},
	formItems: {
		display: 'flex',
		flexDirection: 'column',
		gap: standardStyles.textStyles.sizes.md,
	},
});

const FormDisplay = ({ title, children }: FormDisplay) => {
	return (
		<View style={styles.form}>
			<Title level="h2">{title}</Title>
			<View style={styles.formItems}>{children}</View>
		</View>
	);
};

export default FormDisplay;
