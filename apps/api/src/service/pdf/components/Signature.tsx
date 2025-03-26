import { Image, StyleSheet, View } from '@react-pdf/renderer';
import DataItem from './DataItem.tsx';
import Paragraph from './Paragraph.tsx';
import { standardStyles } from './standardStyling.ts';

interface SignatureProps {
	src?: string | null;
	date?: Date | null;
}

const style = StyleSheet.create({
	signatureView: {
		marginTop: standardStyles.textStyles.sizes.lg,
	},
	image: {
		marginBottom: standardStyles.textStyles.sizes.sm,
		backgroundColor: standardStyles.colours.tertiary,
		padding: `${standardStyles.textStyles.sizes.sm} 0 0 0`,
		maxWidth: '50%',
		borderBottom: 1,
		borderBottomColor: standardStyles.colours.primary,
	},
});

const Signature = ({ src, date }: SignatureProps) => {
	return (
		<View>
			{!src ? (
				<Paragraph notice>&mdash;&nbsp;Signature Missing&nbsp;&mdash;</Paragraph>
			) : (
				<View style={style.signatureView}>
					<Image
						style={style.image}
						src={{
							uri: src,
						}}
					/>
					<DataItem item="Date">{date?.toLocaleString('en-CA', { dateStyle: 'long', timeStyle: 'long' })}</DataItem>
				</View>
			)}
		</View>
	);
};

export default Signature;
