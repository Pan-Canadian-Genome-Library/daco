import { ApplicationContentsResponse } from '@pcgl-daco/data-model';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import Logo from '../Logo/Logo.tsx';
import StandardPage from '../StandardPage.tsx';
import { standardStyles } from '../standardStyling.ts';

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
		<StandardPage ignorePadding showAttribution={true}>
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
