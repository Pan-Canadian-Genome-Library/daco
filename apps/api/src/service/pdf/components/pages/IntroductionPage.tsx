import { View } from '@react-pdf/renderer';
import List from '../List.tsx';
import Paragraph from '../Paragraph.tsx';
import StandardPage from '../StandardPage.tsx';
import Title from '../Title.tsx';

const IntroductionPage = () => {
	return (
		<StandardPage showAttribution showPageNumbers alternatingAttribution>
			<View style={{ display: 'flex', gap: '.75rem' }}>
				<Title>Introduction</Title>
				<Paragraph>
					While all PCGL data sources contain open data, sensitive genomic and clinical data is controlled and requires
					permission to access. To qualify for access, you must:
				</Paragraph>
				<List
					items={[
						'be an independent researcher affiliated with a legal entity (e.g. university professor, researcher in a private company, independent researchers able to apply for federal research grants, etc.)',
						'have an institutional representative at your institution',
						'have a scientific abstract and lay summary outlining the desired use of the PCGL Controlled Data',
						'have at least 3 qualifying publications of which you were an author/co-author',
						'include an ethics letter, if ethics approval for use of PCGL Controlled Data is required in your country/region',
					]}
				/>
				<Paragraph>To receive access, you must:</Paragraph>
				<List
					isNumbered
					items={[
						'Complete all required sections on this application form and agree to its terms',
						'Have the Principal Investigator and Institutional Representative who represents your institutions legal entity sign the finalized application.',
						'Submit the signed application for review by the Data Access Compliance Office (DACO) in the “Sign and Submit” section of this application.',
					]}
				/>
				<Paragraph>
					During the application process, you must submit a summary of your research project. Your project will be
					checked for conformity with the goals and policies of PCGL including, but not limited to, policies concerning
					the purpose and relevance of the research, the protection of the donors and the security of the donors' data.
					If your application is approved, you agree that your applicant's name, institution, and scientific lay summary
					may be included in a public registry of projects that have been granted access to PCGL Controlled Data.
				</Paragraph>
				<Paragraph>
					If the Data Access Compliance Office (DACO) approves your application, access to the PCGL Controlled Data will
					be granted starting from the date you are approved for access. An annual agreement must be made by the
					applicant and a bi-annual renewal must be completed in order to access/use controlled data beyond that
					two-year time period.
				</Paragraph>
			</View>
		</StandardPage>
	);
};

export default IntroductionPage;
