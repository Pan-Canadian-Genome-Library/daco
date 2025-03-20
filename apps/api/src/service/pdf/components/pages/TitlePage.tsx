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

import Logo from '@/service/pdf/components/Logo/Logo.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import { standardStyles } from '@/service/pdf/components/standardStyling.ts';
import { ApplicationContentsResponse } from '@pcgl-daco/data-model';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

interface TitlePageProps extends Pick<ApplicationContentsResponse, 'applicationId' | 'applicantPrimaryAffiliation'> {
	displayLogo?: boolean;
	title: string;
	principalInvestigatorName: string;
	docCreatedAt: Date;
}

const styles = StyleSheet.create({
	page: {
		height: '100vh',
		width: '100vw',
	},
	logoImage: {
		width: '50%',
		margin: '0 0 7% 0',
	},
	content: {
		height: '100vh',
		width: '100vw',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleText: {
		fontSize: standardStyles.textStyles.sizes.xl,
		fontFamily: 'LeagueSpartan',
		fontWeight: 'bold',
	},
	infoGrid: {
		display: 'flex',
		width: '60%',
		alignItems: 'center',
		alignContent: 'center',
		margin: '10% 0 0 0',
		fontFamily: 'OpenSans',
		gap: standardStyles.textStyles.sizes.lg,
		fontSize: standardStyles.textStyles.sizes.sm,
	},
	infoItem: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
	},
	dataQuestion: {
		fontWeight: 'bold',
		flex: 1,
	},
	dataAnswer: {
		fontWeight: 'normal',
	},
});

const TitlePage = ({
	title,
	displayLogo,
	applicationId,
	principalInvestigatorName,
	applicantPrimaryAffiliation,
	docCreatedAt,
}: TitlePageProps) => {
	return (
		<StandardPage ignorePadding showAttribution>
			<View style={styles.content}>
				{displayLogo ? <Logo style={styles.logoImage} /> : null}
				<Text style={styles.titleText}>{title}</Text>
				<View style={styles.infoGrid}>
					<View style={styles.infoItem}>
						<Text style={styles.dataQuestion}>Application Number:</Text>
						<Text style={styles.dataAnswer}>{`PCGL-${applicationId}`}</Text>
					</View>
					<View style={styles.infoItem}>
						<Text style={styles.dataQuestion}>Principal Investigator:</Text>
						<Text style={styles.dataAnswer}>{principalInvestigatorName}</Text>
					</View>
					<View style={styles.infoItem}>
						<Text style={styles.dataQuestion}>Institution:</Text>
						<Text style={styles.dataAnswer}>{applicantPrimaryAffiliation}</Text>
					</View>
					<View style={styles.infoItem}>
						<Text style={styles.dataQuestion}>Document Created On:</Text>
						<Text style={styles.dataAnswer}>
							{docCreatedAt.toLocaleString('en-CA', { dateStyle: 'full', timeStyle: 'long' })}
						</Text>
					</View>
				</View>
			</View>
		</StandardPage>
	);
};

export default TitlePage;
