import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { standardStyles } from './standardStyling.ts';

const styles = StyleSheet.create({
	list: {
		fontFamily: 'OpenSans',
		fontWeight: 'normal',
		lineHeight: '1rem',
		fontSize: standardStyles.textStyles.sizes.md,
		display: 'flex',
		flexDirection: 'column',
		gap: '.3rem',
		padding: '0 0 0 0.7cm',
	},
	listItem: {
		display: 'flex',
		flexDirection: 'row',
		gap: '.5rem',
	},
});
const List = ({ items, isNumbered }: { items: string[]; isNumbered?: boolean }) => {
	return (
		<View style={styles.list}>
			{items.map((li, index) => (
				<View style={styles.listItem}>
					{isNumbered ? <Text>{`${index + 1}.`}</Text> : <Text>&#x2022;</Text>}
					<Text>{`${li}`}</Text>
				</View>
			))}
		</View>
	);
};

export default List;
