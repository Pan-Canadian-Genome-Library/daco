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

import { useMinWidth } from '@/global/hooks/useMinWidth';
import { Flex, Modal, theme, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { useToken } = theme;
const { Text } = Typography;

interface ApplyForAccessModalProps {
	openModal: boolean;
	setOpenModal: (show: boolean) => void;
}

const SELF_ENROLMENT_URL = import.meta.env.VITE_SELF_ENROLMENT_URL || '#';

const ApplyForAccessModal = ({ openModal, setOpenModal }: ApplyForAccessModalProps) => {
	const minWidth = useMinWidth();
	const { t: translate } = useTranslation();
	const { token } = useToken();

	const handleLoginButton = () => {
		setOpenModal(false);
		window.location.href = SELF_ENROLMENT_URL;
	};

	return (
		<Modal
			title={translate('links.apply')}
			okText={translate('button.getStarted')}
			width={'100%'}
			style={{
				top: '20%',
				maxWidth: '800px',
				paddingInline: minWidth <= token.screenSM || minWidth >= token.screenXL ? token.padding : token.paddingXL,
			}}
			open={openModal}
			onOk={handleLoginButton}
			onCancel={() => setOpenModal(false)}
		>
			<Flex>
				<Text>{translate('modals.authorization.description')}</Text>
			</Flex>
		</Modal>
	);
};

export default ApplyForAccessModal;
