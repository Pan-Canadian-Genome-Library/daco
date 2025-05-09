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

import useSubmitApplication from '@/api/mutations/useSubmitApplication';
import useSubmitRevisions from '@/api/mutations/useSubmitRevisions';
import { ApplicationOutletContext } from '@/global/types';
import { Flex, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

const { Text } = Typography;

interface SuccessModalProps {
	isOpen: boolean;
	setIsOpen: (bool: boolean) => void;
}
const SubmitApplicationModal = ({ isOpen, setIsOpen }: SuccessModalProps) => {
	const { t: translate } = useTranslation();
	const { appId, state } = useOutletContext<ApplicationOutletContext>();
	const { mutateAsync: submitApplication, isPending: isSubmitting } = useSubmitApplication();
	const { mutateAsync: submitRevisions, isPending: isSubmittingRevs } = useSubmitRevisions();

	const modalSubmission = () => {
		switch (state) {
			case 'INSTITUTIONAL_REP_REVISION_REQUESTED':
			case 'DAC_REVISIONS_REQUESTED':
				submitRevisions({ applicationId: appId }).then(() => {
					setIsOpen(false);
				});
				break;
			default:
				submitApplication({ applicationId: appId }).then(() => {
					setIsOpen(false);
				});
		}
	};

	return (
		<Modal
			title={translate('sign-and-submit-section.modal.title')}
			okText={translate('sign-and-submit-section.modal.submit')}
			cancelText={translate('sign-and-submit-section.modal.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={isOpen}
			onOk={modalSubmission}
			okButtonProps={{ disabled: isSubmitting || isSubmittingRevs }}
			onCancel={() => setIsOpen(false)}
		>
			<Flex style={{ height: '100%', marginTop: 20 }}>
				<Text>{translate('sign-and-submit-section.modal.description', { id: appId })}</Text>
			</Flex>
		</Modal>
	);
};

export default SubmitApplicationModal;
