/*
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { CollaboratorDTO } from '@pcgl-daco/data-model';
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';

import { standardStyles } from '@/service/pdf/components/standardStyling.ts';

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
		textAlign: 'center',
		width: '100%',
		minWidth: '100%',
		color: standardStyles.colours.primary,
		margin: `${standardStyles.textStyles.sizes.lg} 0`,
		fontSize: standardStyles.textStyles.sizes.md,
	},
});

const CollaboratorsTable = ({ data }: CollaboratorsTable) => {
	const renderRows = () => {
		if (data.length === 0) {
			return (
				<View style={styles.tableNoData}>
					<Text>&mdash; No Collaborators Listed &mdash;</Text>
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
