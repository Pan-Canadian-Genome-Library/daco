import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ReactNode } from 'react';
import { standardStyles } from './standardStyling.ts';

interface FooterProps {
	showAttribution?: boolean;
	showPageNumbers?: boolean;
	alternatingAttribution?: boolean;
}

interface StandardPageProps extends FooterProps {
	children: ReactNode;
	ignorePadding?: boolean;
}

const styles = StyleSheet.create({
	page: {
		backgroundColor: '#fff',
		/**
		 * Standardized margins: https://www.noslangues-ourlanguages.gc.ca/en/writing-tips-plus/reports-margins
		 **/
		padding: '2.5cm 3cm 2.5cm 3cm',
		fontFamily: 'OpenSans',
		fontWeight: 'normal',
	},
	page__noPadding: {
		fontFamily: 'OpenSans',
		fontWeight: 'normal',
		backgroundColor: '#fff',
	},
	footer: {
		width: '100vw',
		left: 0,
		padding: '0 3cm',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		position: 'absolute',
		bottom: '1.25cm',

		fontSize: standardStyles.textStyles.sizes.sm,
	},
	footer__attr: {
		fontFamily: 'LeagueSpartan',
		fontWeight: 'bold',
		flex: 1,
	},
	footer__pageNum: {
		fontFamily: 'OpenSans',
		fontWeight: 'normal',
		textAlign: 'right',
	},
});

const Footer = ({ showAttribution, showPageNumbers, alternatingAttribution }: FooterProps) => {
	return (
		<View fixed style={styles.footer}>
			{showAttribution ? (
				<Text
					style={styles.footer__attr}
					render={({ pageNumber }) => {
						if (alternatingAttribution) {
							return pageNumber % 2 === 0
								? `Pan-Canadian Genome Library Data Access Compliance Office`
								: `Application for Access to PCGL Controlled Data`;
						} else {
							return `Pan-Canadian Genome Library Data Access Compliance Office`;
						}
					}}
				/>
			) : null}
			{showPageNumbers ? (
				<Text
					style={showAttribution ? { ...styles.footer__pageNum, flex: 0.5 } : { ...styles.footer__pageNum, flex: 1 }}
					render={({ pageNumber }) => `${pageNumber}`}
				/>
			) : null}
		</View>
	);
};

const StandardPage = ({
	children,
	showAttribution = true,
	showPageNumbers = true,
	ignorePadding = false,
	alternatingAttribution = false,
}: StandardPageProps) => {
	return (
		<Page size={'A4'} style={ignorePadding ? styles.page__noPadding : styles.page}>
			{children}
			<Footer
				alternatingAttribution={alternatingAttribution}
				showAttribution={showAttribution}
				showPageNumbers={showPageNumbers}
			/>
		</Page>
	);
};

export default StandardPage;
