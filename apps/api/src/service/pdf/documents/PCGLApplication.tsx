import { ApplicationResponseData, SignatureDTO } from '@pcgl-daco/data-model';
import { Document, Font, renderToBuffer, StyleSheet } from '@react-pdf/renderer';
import ApplicantInformation from '../components/pages/ApplicantInformation.tsx';
import IntroductionPage from '../components/pages/IntroductionPage.tsx';
import TitlePage from '../components/pages/TitlePage.tsx';
import { standardStyles } from '../components/standardStyling.ts';

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

const PCGLApplication = ({ applicationContents, signature, docCreatedAt }: PCGLApplicationProps) => (
	<Document title="PCGL DACO Agreement" style={styles.document}>
		<TitlePage
			applicationId={applicationContents.id}
			docCreatedAt={docCreatedAt}
			title={'Application for Access to PCGL Controlled Data'}
			principalInvestigatorName={`${applicationContents.contents?.applicantFirstName ?? ''} ${applicationContents.contents?.applicantLastName ?? '—'}`}
			applicantPrimaryAffiliation={applicationContents.contents?.applicantPrimaryAffiliation ?? '—'}
			displayLogo
		/>
		<IntroductionPage />
		<ApplicantInformation />
	</Document>
);

const renderApplicationPDF = async ({ applicationContents, signature, docCreatedAt }: PCGLApplicationProps) => {
	return await renderToBuffer(
		<PCGLApplication docCreatedAt={docCreatedAt} applicationContents={applicationContents} signature={signature} />,
	);
};

export { renderApplicationPDF };
