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

import { ApplicationResponseData, CollaboratorDTO, SignatureDTO } from '@pcgl-daco/data-model';
import { Document, Font, renderToBuffer, StyleSheet } from '@react-pdf/renderer';

import { standardStyles } from '@/service/pdf/components/standardStyling.ts';

import Appendices from '@/service/pdf/components/pages/Appendices.tsx';
import ApplicantInformation from '@/service/pdf/components/pages/ApplicantInformation.tsx';
import Collaborators from '@/service/pdf/components/pages/Collaborators.tsx';
import DataAccessAgreement from '@/service/pdf/components/pages/DataAccessAgreement/DataAccessAgreement.tsx';
import TermsAndConditions from '@/service/pdf/components/pages/DataAccessAgreement/TermsAndConditions.tsx';
import Ethics from '@/service/pdf/components/pages/Ethics.tsx';
import InstitutionalRepresentative from '@/service/pdf/components/pages/InstitutionalRepresentative.tsx';
import IntroductionPage from '@/service/pdf/components/pages/IntroductionPage.tsx';
import ProjectInformation from '@/service/pdf/components/pages/ProjectInformation.tsx';
import RequestedStudy from '@/service/pdf/components/pages/RequestedStudy.tsx';
import SignSubmit from '@/service/pdf/components/pages/SignSubmit.tsx';
import TitlePage from '@/service/pdf/components/pages/TitlePage.tsx';

interface PCGLApplicationProps {
	applicationContents: ApplicationResponseData;
	signature: SignatureDTO;
	collaborators: CollaboratorDTO[];
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
 * Closest openly licensed font similar enough to our PCGL brand font (Futura),
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

const PCGLApplication = ({ applicationContents, signature, collaborators, docCreatedAt }: PCGLApplicationProps) => {
	const contents = applicationContents.contents;

	return (
		<Document
			title={`PCGL-${applicationContents.id} - DACO - Application for Access to PCGL Controlled Data`}
			style={styles.document}
		>
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
				applicantInstitutionCountry={contents?.applicantInstitutionCountry}
				applicantInstitutionState={contents?.applicantInstitutionState}
				applicantInstitutionStreetAddress={contents?.applicantInstitutionStreetAddress}
				applicantInstitutionBuilding={contents?.applicantInstitutionBuilding}
				applicantInstitutionCity={contents?.applicantInstitutionCity}
				applicantInstitutionPostalCode={contents?.applicantInstitutionPostalCode}
			/>
			<InstitutionalRepresentative
				institutionalRepTitle={contents?.institutionalRepTitle}
				institutionalRepFirstName={contents?.institutionalRepFirstName}
				institutionalRepMiddleName={contents?.institutionalRepMiddleName}
				institutionalRepLastName={contents?.institutionalRepLastName}
				institutionalRepSuffix={contents?.institutionalRepSuffix}
				institutionalRepPrimaryAffiliation={contents?.institutionalRepPrimaryAffiliation}
				institutionalRepEmail={contents?.institutionalRepEmail}
				institutionalRepProfileUrl={contents?.institutionalRepProfileUrl}
				institutionalRepPositionTitle={contents?.institutionalRepPositionTitle}
				institutionCountry={contents?.institutionCountry}
				institutionState={contents?.institutionState}
				institutionStreetAddress={contents?.institutionStreetAddress}
				institutionBuilding={contents?.institutionBuilding}
				institutionCity={contents?.institutionCity}
				institutionPostalCode={contents?.institutionPostalCode}
			/>
			<Collaborators collaborators={collaborators} />
			<ProjectInformation
				projectTitle={contents?.projectTitle}
				projectWebsite={contents?.projectWebsite}
				projectBackground={contents?.projectBackground}
				projectAims={contents?.projectAims}
				projectSummary={contents?.projectSummary}
				projectMethodology={contents?.projectMethodology}
				projectPublicationUrls={contents?.projectPublicationUrls}
			/>
			<RequestedStudy requestedStudies={contents?.requestedStudies} />
			<Ethics ethicsReviewRequired={contents?.ethicsReviewRequired} />
			<DataAccessAgreement />
			<TermsAndConditions acceptedAgreements={contents?.acceptedAgreements} />
			<Appendices acceptedAppendices={contents?.acceptedAppendices} />
			<SignSubmit
				applicantFirstName={contents?.applicantFirstName}
				applicantMiddleName={contents?.applicantMiddleName}
				applicantLastName={contents?.applicantLastName}
				applicantPositionTitle={contents?.applicantPositionTitle}
				applicantPrimaryAffiliation={contents?.applicantPrimaryAffiliation}
				applicantSignature={signature.applicantSignature}
				applicantSignedAt={signature.applicantSignedAt}
				institutionalRepFirstName={contents?.institutionalRepFirstName}
				institutionalRepMiddleName={contents?.institutionalRepMiddleName}
				institutionalRepLastName={contents?.institutionalRepLastName}
				institutionalRepPositionTitle={contents?.institutionalRepPositionTitle}
				institutionalRepPrimaryAffiliation={contents?.institutionalRepPrimaryAffiliation}
				institutionalRepSignature={signature.institutionalRepSignature}
				institutionalRepSignedAt={signature.institutionalRepSignedAt}
			/>
		</Document>
	);
};

const renderApplicationPDF = async ({
	applicationContents,
	signature,
	collaborators,
	docCreatedAt,
}: PCGLApplicationProps) => {
	return await renderToBuffer(
		<PCGLApplication
			collaborators={collaborators}
			docCreatedAt={docCreatedAt}
			applicationContents={applicationContents}
			signature={signature}
		/>,
	);
};

export { renderApplicationPDF };
