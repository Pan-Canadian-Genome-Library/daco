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

import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ReactNode } from 'react';

import { standardStyles } from '@/service/pdf/components/standardStyling.ts';
interface FooterProps {
	showAttribution?: boolean;
	showPageNumbers?: boolean;
	alternatingAttribution?: boolean;
}

interface StandardPageProps extends FooterProps {
	children: ReactNode;
	ignorePadding?: boolean;
	useVerticalStackLayout?: boolean;
	fixed?: boolean;
}

const styles = StyleSheet.create({
	page: {
		/**
		 * Standardized margins based off of Word & https://www.noslangues-ourlanguages.gc.ca/en/writing-tips-plus/reports-margins
		 **/
		padding: '2.5cm 2.5cm 2.5cm 2.5cm',
		fontFamily: 'OpenSans',
		fontWeight: 'normal',
		backgroundColor: '#fff',
	},
	page__noPadding: {
		fontFamily: 'OpenSans',
		fontWeight: 'normal',
		backgroundColor: '#fff',
	},
	footer: {
		width: '100vw',
		left: 0,
		padding: '0 2.5cm',
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
	useVerticalStackLayout = false,
	fixed = false,
}: StandardPageProps) => {
	return (
		<Page size={'LETTER'} fixed={fixed} style={ignorePadding ? styles.page__noPadding : styles.page}>
			{useVerticalStackLayout ? (
				<View style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>{children}</View>
			) : (
				children
			)}
			<Footer
				alternatingAttribution={alternatingAttribution}
				showAttribution={showAttribution}
				showPageNumbers={showPageNumbers}
			/>
		</Page>
	);
};

export default StandardPage;
