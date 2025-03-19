import { type ApplicationSignatureUpdate, type JoinedApplicationRecord } from '@/service/types.ts';
import { Document, Font, renderToBuffer, StyleSheet } from '@react-pdf/renderer';
import IntroductionPage from '../components/pages/IntroductionPage.tsx';
import TitlePage from '../components/pages/TitlePage.tsx';
import { standardStyles } from '../components/standardStyling.ts';

interface PCGLApplicationProps {
	applicationContents: JoinedApplicationRecord;
	signature: ApplicationSignatureUpdate;
}

Font.register({
	family: 'OpenSans',
	fonts: [
		{ src: standardStyles.textStyles.fonts.openSansLight, fontWeight: 'light' },
		{ src: standardStyles.textStyles.fonts.openSansRegular, fontWeight: 'normal' },
		{ src: standardStyles.textStyles.fonts.openSansBold, fontWeight: 'bold' },
	],
});
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

const PCGLApplication = ({ applicationContents, signature }: PCGLApplicationProps) => (
	<Document title="PCGL DACO Agreement" style={styles.document}>
		<TitlePage title={'Application for Access to PCGL Controlled Data'} displayLogo />
		<IntroductionPage />
	</Document>
);

const renderApplicationPDF = async ({ applicationContents, signature }: PCGLApplicationProps) => {
	return await renderToBuffer(<PCGLApplication applicationContents={applicationContents} signature={signature} />);
};

export { renderApplicationPDF };
