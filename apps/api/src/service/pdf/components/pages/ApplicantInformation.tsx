import { View } from '@react-pdf/renderer';
import Paragraph from '../Paragraph.tsx';
import StandardPage from '../StandardPage.tsx';
import Title from '../Title.tsx';

const ApplicantInformation = () => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>Applicant Information (Principal Investigator)</Title>
			<Paragraph>
				Qualified applicants for access to the PCGL Controlled Data must be independent researchers who are affiliated
				with a legal entity (e.g. university professor, researcher in a private company, independent researchers able to
				apply for federal research grants, etc.).
			</Paragraph>
			<Paragraph>
				Please include a valid institutional email address that will be used to log in to PCGL and will be the email
				address associated with PCGL Controlled Data access.
			</Paragraph>
			<View></View>
		</StandardPage>
	);
};

export default ApplicantInformation;
