import { Document, Page, renderToBuffer, StyleSheet, Text, View } from '@react-pdf/renderer';
import Logo from './Logo/Logo.tsx';
import Signature from './Signature.tsx';

// Create styles
const styles = StyleSheet.create({
	document: {},
	page: {
		flexDirection: 'column',
		backgroundColor: '#fff',
	},
	section1: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		margin: 10,
		padding: 10,
		fontWeight: 800,
		fontSize: '14px',
		height: 'auto',
	},
	nestedView: {
		marginLeft: 20,
		marginRight: 10,
	},
	section2: {
		margin: 15,
		padding: 10,
		flexGrow: 1,
		fontWeight: 300,
	},
	smallerText: {
		fontSize: '.75rem',
	},
});

// Create Document Component
const MyDocument = () => (
	<Document
		title="PCGL DACO Agreement / Accord du bureau de conformité de l'accès aux données BGP"
		style={styles.document}
	>
		<Page size="A4" style={styles.page}>
			<View style={styles.section1}>
				<Logo />
				<View style={styles.nestedView}>
					<Text style={{ ...styles.smallerText, marginTop: '-15px', marginBottom: '15px' }}>
						{'Application for Access to PCGL Controlled Data'}
					</Text>
					<Text style={styles.smallerText}>{"Demande d'accès aux données contrôlées de BGP"}</Text>
				</View>
			</View>
			<View style={styles.section2}>
				<Text>Hello React Rendering</Text>
				<Text style={{ ...styles.smallerText, marginTop: '15px' }}>
					An example of a base64 encoded signature below:
				</Text>
				<Signature />
			</View>
		</Page>
	</Document>
);

const renderPDF = async () => {
	return await renderToBuffer(<MyDocument />);
};

export { renderPDF };
