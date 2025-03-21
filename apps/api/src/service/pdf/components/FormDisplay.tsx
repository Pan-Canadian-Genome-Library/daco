import { StyleSheet, View } from '@react-pdf/renderer';
import { ReactNode } from 'react';
import Title from './Title.tsx';
import { standardStyles } from './standardStyling.ts';

interface FormDisplay {
	title: string;
	children: ReactNode;
	fixed?: boolean;
	wrap?: boolean;
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

const FormDisplay = ({ title, children, fixed = false, wrap = true }: FormDisplay) => {
	return (
		<View style={styles.form} fixed={fixed} wrap={wrap}>
			<Title level="h2">{title}</Title>
			<View style={styles.formItems}>{children}</View>
		</View>
	);
};

export default FormDisplay;
