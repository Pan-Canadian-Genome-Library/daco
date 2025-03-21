import { Path, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';
import { standardStyles } from './standardStyling.ts';

interface CheckboxProps {
	children: string;
	unchecked?: boolean;
}

const styles = StyleSheet.create({
	checkboxContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: standardStyles.textStyles.sizes.md,
	},
	checkboxImageContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: standardStyles.textStyles.sizes.lg,
		width: standardStyles.textStyles.sizes.lg,
		borderRadius: '2.5px',
		padding: '1.25px',
	},
	checkboxPath: {
		fill: '#fff',
	},
	checkboxText: {
		fontSize: standardStyles.textStyles.sizes.md,
	},
});

const Checkbox = ({ children, unchecked }: CheckboxProps) => {
	return (
		<View style={styles.checkboxContainer}>
			<View
				style={{
					...styles.checkboxImageContainer,
					backgroundColor: unchecked ? '#fff' : standardStyles.colours.primary,
					border: unchecked ? `1.25px solid ${standardStyles.colours.grey}` : '0',
				}}
			>
				{!unchecked ? (
					<Svg width="16" height="16" viewBox="0 0 16 16">
						<Path
							style={styles.checkboxPath}
							d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"
						/>
					</Svg>
				) : null}
			</View>
			<Text style={styles.checkboxText}>{children}</Text>
		</View>
	);
};

export default Checkbox;
