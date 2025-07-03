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

import { StyleSheet, View } from '@react-pdf/renderer';

import Logo from '@/service/pdf/components/Logo/Logo.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import { standardStyles } from '@/service/pdf/components/standardStyling.ts';
import Title from '@/service/pdf/components/Title.tsx';

const styles = StyleSheet.create({
	link: {
		color: standardStyles.colours.primary,
	},
	text: {
		fontSize: standardStyles.textStyles.sizes.md,
	},
	logoImage: {
		width: '50%',
		margin: '0 0 0 0',
	},
	content: {
		height: '100vh',
		width: '100vw',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const EndOfDocument = () => {
	return (
		<StandardPage ignorePadding showAttribution alternatingAttribution showPageNumbers>
			<View style={styles.content}>
				<Logo colour={true} style={styles.logoImage} />
				<Title style={{ paddingTop: '2.5cm' }} level="h2">
					&mdash;&nbsp;END OF DOCUMENT&nbsp;&mdash;
				</Title>
				<Paragraph
					style={{
						fontWeight: 500,
						paddingTop: '.75cm',
					}}
				>
					Attached Ethics Letter and Appendices to follow.
				</Paragraph>
			</View>
		</StandardPage>
	);
};

export default EndOfDocument;
