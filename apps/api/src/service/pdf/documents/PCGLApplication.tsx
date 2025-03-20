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

import ApplicantInformation from '@/service/pdf/components/pages/ApplicantInformation.tsx';
import IntroductionPage from '@/service/pdf/components/pages/IntroductionPage.tsx';
import TitlePage from '@/service/pdf/components/pages/TitlePage.tsx';
import { standardStyles } from '@/service/pdf/components/standardStyling.ts';
import { ApplicationResponseData, SignatureDTO } from '@pcgl-daco/data-model';
import { Document, Font, renderToBuffer, StyleSheet } from '@react-pdf/renderer';

interface PCGLApplicationProps {
	applicationContents: ApplicationResponseData;
	signature: SignatureDTO;
	docCreatedAt: Date;
}
/**
 * Open Sans is openly licensed and used on our front end. While React PDF has its own font
 * the rendering of it seemed weird, and felt hard to read when rending upon the page.
 */
Font.register({
	family: 'OpenSans',
	fonts: [
		{ src: standardStyles.textStyles.fonts.openSansLight, fontWeight: 'light' },
		{ src: standardStyles.textStyles.fonts.openSansRegular, fontWeight: 'normal' },
		{ src: standardStyles.textStyles.fonts.openSansBold, fontWeight: 'bold' },
	],
});
/**
 * Closest openly licensed font similar enough to our PCGL brand font,
 * this was a suggestion OK'd by Patrick.
 */
Font.register({
	family: 'LeagueSpartan',
	fonts: [
		{ src: standardStyles.textStyles.fonts.leagueSpartanLight, fontWeight: 'light' },
		{ src: standardStyles.textStyles.fonts.leagueSpartanRegular, fontWeight: 'normal' },
		{ src: standardStyles.textStyles.fonts.leagueSpartanBold, fontWeight: 'bold' },
	],
});

// Create styles
const styles = StyleSheet.create({
	document: {
		fontFamily: 'OpenSans',
		height: '100vh',
		width: '100vw',
	},
});

const PCGLApplication = ({ applicationContents, signature, docCreatedAt }: PCGLApplicationProps) => {
	const contents = applicationContents.contents;

	return (
		<Document title="PCGL DACO Agreement" style={styles.document}>
			<TitlePage
				applicationId={applicationContents.id}
				docCreatedAt={docCreatedAt}
				title={'Application for Access to PCGL Controlled Data'}
				principalInvestigatorName={`${contents?.applicantFirstName ?? ''} ${contents?.applicantLastName ?? '—'}`}
				applicantPrimaryAffiliation={contents?.applicantPrimaryAffiliation ?? '—'}
				displayLogo
			/>
			<IntroductionPage />
			<ApplicantInformation
				applicantFirstName={contents?.applicantFirstName}
				applicantMiddleName={contents?.applicantMiddleName}
				applicantLastName={contents?.applicantLastName}
				applicantTitle={contents?.applicantTitle}
				applicantSuffix={contents?.applicantSuffix}
				applicantPrimaryAffiliation={contents?.applicantPrimaryAffiliation}
				applicantInstitutionalEmail={contents?.applicantInstitutionalEmail}
				applicantProfileUrl={contents?.applicantProfileUrl}
				applicantPositionTitle={contents?.applicantPositionTitle}
				institutionCountry={contents?.institutionCountry}
				institutionState={contents?.institutionState}
				institutionStreetAddress={contents?.institutionStreetAddress}
				institutionBuilding={contents?.institutionBuilding}
				institutionCity={contents?.institutionCity}
				institutionPostalCode={contents?.institutionPostalCode}
			/>
		</Document>
	);
};

const renderApplicationPDF = async ({ applicationContents, signature, docCreatedAt }: PCGLApplicationProps) => {
	return await renderToBuffer(
		<PCGLApplication docCreatedAt={docCreatedAt} applicationContents={applicationContents} signature={signature} />,
	);
};

export { renderApplicationPDF };
