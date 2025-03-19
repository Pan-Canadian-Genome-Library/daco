import { StyleSheet, Text, View } from '@react-pdf/renderer';
import Logo from '../Logo/Logo.tsx';
import StandardPage from '../StandardPage.tsx';
import { standardStyles } from '../standardStyling.ts';

interface TitlePageProps {
	displayLogo?: boolean;
	title: string;
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

const TitlePage = ({ title, displayLogo }: TitlePageProps) => {
	return (
		<StandardPage ignorePadding showAttribution={false}>
			<View style={styles.content}>
				{displayLogo ? <Logo style={styles.logoImage} /> : null}
				<Text style={styles.titleText}>{title}</Text>
				<View style={styles.infoGrid}>
					<View style={styles.infoItem}>
						<Text style={styles.dataQuestion}>Application Number:</Text>
						<Text style={styles.dataAnswer}> PCGL-123</Text>
					</View>
					<View style={styles.infoItem}>
						<Text style={styles.dataQuestion}>Principal Investigator:</Text>
						<Text style={styles.dataAnswer}>Jane Doe</Text>
					</View>
					<View style={styles.infoItem}>
						<Text style={styles.dataQuestion}>Institution:</Text>
						<Text style={styles.dataAnswer}>Ontario Institute for Cancer Research</Text>
					</View>
					<View style={styles.infoItem}>
						<Text style={styles.dataQuestion}>Document Created On:</Text>
						<Text style={styles.dataAnswer}>Tuesday, Feb. 18, 2025 at 11:00 AM</Text>
					</View>
				</View>
			</View>
		</StandardPage>
	);
};

export default TitlePage;
