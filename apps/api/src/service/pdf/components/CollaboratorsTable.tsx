import { CollaboratorDTO } from '@pcgl-daco/data-model';
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import { standardStyles } from './standardStyling.ts';

interface CollaboratorsTable {
	data: CollaboratorDTO[];
}

const styles = StyleSheet.create({
	form: {
		marginTop: standardStyles.textStyles.sizes.xl,
		gap: 0,
		display: 'flex',
		width: '100%',
		alignItems: 'flex-start',
		flexDirection: 'column',
	},
	tableHeader: {
		display: 'flex',
		flexDirection: 'row',
		gap: 0,
	},
	tableHeader__Text: {
		fontSize: standardStyles.textStyles.sizes.sm,
		fontWeight: 'bold',
		minWidth: '25%',
		maxWidth: '25%',
		padding: `${standardStyles.textStyles.sizes.sm} 0pt ${standardStyles.textStyles.sizes.sm} ${standardStyles.textStyles.sizes.sm}`,
		textAlign: 'left',
		border: `1px solid ${standardStyles.colours.grey}`,
		backgroundColor: `${standardStyles.colours.lightGrey}`,
	},
	tableBody: {
		display: 'flex',
		flexDirection: 'column',
		gap: 0,
	},
	tableContents: {
		display: 'flex',
		flexDirection: 'row',
		gap: 0,
		borderBottom: `1px solid ${standardStyles.colours.grey}`,
	},
	tableContents__Text: {
		fontSize: standardStyles.textStyles.sizes.sm,
		minWidth: '25%',
		maxWidth: '25%',
		padding: `${standardStyles.textStyles.sizes.sm} 0 ${standardStyles.textStyles.sizes.sm} ${standardStyles.textStyles.sizes.sm}`,
		textAlign: 'left',
	},
	tableContents__Link: {
		color: '#000',
	},
	tableNoData: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		padding: `${standardStyles.textStyles.sizes.md}`,
		fontSize: standardStyles.textStyles.sizes.md,
	},
});

const CollaboratorsTable = ({ data }: CollaboratorsTable) => {
	const renderRows = () => {
		if (data.length === 0) {
			return (
				<View style={styles.tableNoData}>
					<Text>&mdash; No Collaborators Listed &mdash; </Text>
				</View>
			);
		}

		return data.map((collaborator, row) => (
			<View
				style={{ ...styles.tableContents, backgroundColor: row % 2 === 0 ? '#fff' : standardStyles.colours.tertiary }}
				key={collaborator.collaboratorFirstName + collaborator.collaboratorLastName}
			>
				<Text style={styles.tableContents__Text}>{collaborator.collaboratorFirstName ?? '—'}</Text>
				<Text style={styles.tableContents__Text}>{collaborator.collaboratorLastName ?? '—'}</Text>
				<Text wrap style={styles.tableContents__Text}>
					{collaborator.collaboratorInstitutionalEmail ? (
						<Link style={styles.tableContents__Link} src={`mailto:${collaborator.collaboratorInstitutionalEmail}`}>
							{collaborator.collaboratorInstitutionalEmail}
						</Link>
					) : (
						'—'
					)}
				</Text>
				<Text style={styles.tableContents__Text}>{collaborator.collaboratorPositionTitle ?? '—'}</Text>
			</View>
		));
	};

	return (
		<View style={styles.form}>
			<View style={styles.tableHeader}>
				<Text style={styles.tableHeader__Text}>First Name</Text>
				<Text style={{ ...styles.tableHeader__Text, borderLeft: 'none' }}>Last Name</Text>
				<Text style={{ ...styles.tableHeader__Text, borderRight: 'none', borderLeft: 'none' }}>
					Instructional Email
				</Text>
				<Text style={{ ...styles.tableHeader__Text, width: 'auto' }}>Position Title</Text>
			</View>
			<View style={styles.tableBody}>{renderRows()}</View>
		</View>
	);
};

export default CollaboratorsTable;
