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
import { Flex, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

type AddCollaboratorModalProps = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
};

const AddCollaboratorModal = ({ isOpen, setIsOpen }: AddCollaboratorModalProps) => {
	const { t: translate } = useTranslation();

	return (
		<Modal
			title={'Add A Collaborator'}
			okText={'Add Collaborator'}
			cancelText={translate('button.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={isOpen}
			onOk={() => setIsOpen(false)}
			onCancel={() => setIsOpen(false)}
		>
			<Flex style={{ height: '100%', marginTop: 20 }}>
				<Text>
					{
						'Please fill out the following information for the collaborator, including a valid institutional email address that they will use to log in to PCGL and will be the email address associated with PCGL Controlled Data access.'
					}
				</Text>
			</Flex>
		</Modal>
	);
};

export default AddCollaboratorModal;
