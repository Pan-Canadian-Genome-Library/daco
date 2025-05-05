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

import { Link, StyleSheet, Text } from '@react-pdf/renderer';

import Checkbox from '@/service/pdf/components/Checkbox.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import { standardStyles } from '@/service/pdf/components/standardStyling.ts';
import Title from '@/service/pdf/components/Title.tsx';
import { type AppendicesDTO, appendicesEnum } from '@pcgl-daco/data-model';

const styles = StyleSheet.create({
	link: {
		color: standardStyles.colours.primary,
	},
	text: {
		fontSize: standardStyles.textStyles.sizes.md,
	},
});

const Appendices = ({ acceptedAppendices }: AppendicesDTO) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>Appendices</Title>
			<Paragraph>Please review and agree to the following Appendices.</Paragraph>
			<FormDisplay title="PCGL Policies">
				<Checkbox unchecked={!acceptedAppendices?.find((appendix) => appendix === appendicesEnum[0])}>
					<Text style={styles.text}>
						You have read APPENDIX I &mdash;{' '}
						<Link src="#" style={styles.link}>
							PCGL Goals and Policies
						</Link>
					</Text>
				</Checkbox>
				<Checkbox unchecked={!acceptedAppendices?.find((appendix) => appendix === appendicesEnum[1])}>
					<Text style={styles.text}>
						You have read APPENDIX II &mdash;{' '}
						<Link src="#" style={styles.link}>
							Data Access and Data Use Policies and Guidelines
						</Link>
					</Text>
				</Checkbox>
				<Checkbox unchecked={!acceptedAppendices?.find((appendix) => appendix === appendicesEnum[2])}>
					<Text style={styles.text}>
						You have read APPENDIX III &mdash;{' '}
						<Link src="#" style={styles.link}>
							Intellectual Property Policy
						</Link>
					</Text>
				</Checkbox>
			</FormDisplay>
		</StandardPage>
	);
};

export default Appendices;
