/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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
import { APPENDICES } from '@/service/pdf/components/translations/enTranslations.ts';
import { FR_APPENDICES } from '@/service/pdf/components/translations/frTranslations.ts';
import { type LanguagProps, SupportedLangs } from '@/service/pdf/components/translations/types.ts';
import { type AppendicesDTO, appendicesEnum } from '@pcgl-daco/data-model';

type AppendicesProps = LanguagProps & AppendicesDTO;

const styles = StyleSheet.create({
	link: {
		color: standardStyles.colours.primary,
	},
	text: {
		fontSize: standardStyles.textStyles.sizes.md,
	},
});

const Appendices = ({ acceptedAppendices, lang = SupportedLangs.ENGLISH }: AppendicesProps) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{lang === SupportedLangs.ENGLISH ? APPENDICES.TITLE : FR_APPENDICES.TITLE}</Title>
			<Paragraph>{lang === SupportedLangs.ENGLISH ? APPENDICES.DESCRIPTION : FR_APPENDICES.DESCRIPTION}</Paragraph>
			<FormDisplay
				title={lang === SupportedLangs.ENGLISH ? APPENDICES.PCGL_POLICIES_TITLE : FR_APPENDICES.PCGL_POLICIES_TITLE}
			>
				<Checkbox unchecked={!acceptedAppendices?.find((appendix) => appendix === appendicesEnum[0])}>
					<Text style={styles.text}>
						{lang === SupportedLangs.ENGLISH ? APPENDICES.APPENDIX_I : FR_APPENDICES.APPENDIX_I} &mdash;{' '}
						<Link src="#" style={styles.link}>
							PCGL Goals and Policies
						</Link>
					</Text>
				</Checkbox>
				<Checkbox unchecked={!acceptedAppendices?.find((appendix) => appendix === appendicesEnum[1])}>
					<Text style={styles.text}>
						{lang === SupportedLangs.ENGLISH ? APPENDICES.APPENDIX_II : FR_APPENDICES.APPENDIX_II} &mdash;{' '}
						<Link src="#" style={styles.link}>
							Data Access and Data Use Policies and Guidelines
						</Link>
					</Text>
				</Checkbox>
				<Checkbox unchecked={!acceptedAppendices?.find((appendix) => appendix === appendicesEnum[2])}>
					<Text style={styles.text}>
						{lang === SupportedLangs.ENGLISH ? APPENDICES.APPENDIX_III : FR_APPENDICES.APPENDIX_III} &mdash;{' '}
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
