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

import { View } from '@react-pdf/renderer';

import Checkbox from '@/service/pdf/components/Checkbox.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
import { EthicsLetterDTO } from '@pcgl-daco/data-model/src/types.ts';

const Ethics = ({ ethicsReviewRequired }: EthicsLetterDTO) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>Ethics</Title>
			<Paragraph>
				PCGL is aware that some countries/regions do not require ethics approval for use of coded data (i.e. use of the
				PCGL Controlled Data). Depending on the nature of your research project, it is possible, however, that such
				approval is needed in your country. If you are uncertain as to whether your research project needs ethics
				approval to use PCGL Controlled Data, we suggest you contact your local institutional review board / research
				ethics committee (IRB/REC) to clarify the matter.
			</Paragraph>
			<Paragraph>
				Please note: The PCGL DACO and the PCGL are not responsible for the ethics approval/monitoring of individual
				research projects and bear no responsibility for the applicant's failure to comply with local/national ethical
				requirements.
			</Paragraph>
			<FormDisplay title="Ethics Approval">
				<Checkbox
					unchecked={
						ethicsReviewRequired === true || ethicsReviewRequired === null || ethicsReviewRequired === undefined
					}
				>
					You represent and warrant that your country/region does not require your research project to undergo ethics
					review. An ethics exemption letter has been uploaded
				</Checkbox>
				<Checkbox unchecked={!ethicsReviewRequired}>
					Your country/region requires your Research Project to undergo ethics review, and therefore, this research
					project has been approved by an IRB/REC formally designated to approve and/or monitor research involving
					humans. As per the Data Access Agreement (see Section F) current and applicable ethical approval is the
					responsibility of the Principal Investigator
				</Checkbox>
				{ethicsReviewRequired !== undefined && ethicsReviewRequired !== null ? (
					<View
						wrap={false}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: '50%',
						}}
					>
						<Paragraph notice>
							&mdash;&nbsp;Ethics {ethicsReviewRequired === true ? `approval` : 'exemption'} letter is attached at end
							of this document.&nbsp;&mdash;
						</Paragraph>
					</View>
				) : null}
			</FormDisplay>
		</StandardPage>
	);
};

export default Ethics;
