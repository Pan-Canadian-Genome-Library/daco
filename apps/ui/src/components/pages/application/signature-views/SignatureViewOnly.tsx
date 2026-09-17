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

import SectionContent from '@/components/pages/application/SectionContent';
import SectionTitle from '@/components/pages/application/SectionTitle';
import SignatureViewer from '@/components/pages/application/SignatureViewer';
import RevisionsAlert from '@/components/RevisionsAlert';
import { ApplicationOutletContext } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { SignatureDTO } from '@pcgl-daco/data-model';
import { Flex, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';
import DacComments from '../collapse/DacComments';

type Props = {
	signatureData?: SignatureDTO;
	signatureLoading: boolean;
	setOpenModal: (bool: boolean) => void;
};

const { Text } = Typography;

const SignatureViewOnly = ({ signatureData, signatureLoading }: Props) => {
	const { t: translate } = useTranslation();
	const {
		state: { fields },
	} = useApplicationContext();
	const { revisions, dacComments, disabledDacComments } = useOutletContext<ApplicationOutletContext>();

	const { applicantFirstName, applicantLastName, institutionalRepFirstName, institutionalRepLastName } = fields;

	return (
		<>
			<SectionTitle title={translate('sign-and-submit-section.title')} showLockIcon={true} showDivider={false}>
				<Text>{translate('sign-and-submit-section.descriptionViewOnly')}</Text>
			</SectionTitle>
			{dacComments.length > 0 || revisions['sign'].length > 0 ? (
				<SectionContent showDivider={false}>
					<Row>
						<DacComments sectionComments={dacComments} section="sign" disabled={disabledDacComments} />
						<RevisionsAlert sectionRevisions={revisions['sign']} general={revisions.general} />{' '}
					</Row>
				</SectionContent>
			) : null}
			<SectionContent showDivider={false}>
				<Flex vertical gap={'large'}>
					{!signatureLoading ? (
						<SignatureViewer
							title={translate('generic.applicant')}
							name={`${applicantFirstName} ${applicantLastName}`}
							signature={signatureData?.applicantSignature}
							date={signatureData?.applicantSignedAt}
						/>
					) : null}
					{!signatureLoading ? (
						<SignatureViewer
							title={translate('generic.rep')}
							name={`${institutionalRepFirstName} ${institutionalRepLastName}`}
							signature={signatureData?.institutionalRepSignature}
							date={signatureData?.institutionalRepSignedAt}
						/>
					) : null}
				</Flex>
			</SectionContent>
		</>
	);
};

export default SignatureViewOnly;
