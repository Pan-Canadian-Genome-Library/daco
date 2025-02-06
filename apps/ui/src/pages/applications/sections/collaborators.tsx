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

import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Space, Table, TableProps, theme } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import AddCollaboratorModal from '@/components/pages/application/modals/AddCollaboratorModal';
import EditCollaboratorModal from '@/components/pages/application/modals/EditCollaboratorModal';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationOutletContext } from '@/global/types';

const { useToken } = theme;

interface CollabTableData {
	id: number;
	firstName: string;
	lastName: string;
	institutionalEmail: string;
	title: string;
	suffix?: string;
}

export interface ModalState {
	rowData?: CollabTableData;
	isOpen: boolean;
}

const Collaborators = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();
	const { token } = useToken();

	// MODAL STATES
	const [openAddCollaboratorModal, setOpenAddCollaboratorModal] = useState(false);
	const [editModalState, setEditModalState] = useState<ModalState>({ isOpen: false });

	const columns: TableProps<CollabTableData>['columns'] = [
		{
			key: 'firstName',
			title: 'First Name',
			dataIndex: 'firstName',
		},
		{
			key: 'lastName',
			title: 'Last Name',
			dataIndex: 'lastName',
		},
		{
			key: 'institutionalEmail',
			title: 'Institutional Email',
			dataIndex: 'institutionalEmail',
		},
		{
			key: 'title',
			title: 'Position Title',
			dataIndex: 'title',
		},
		{
			key: 'tools',
			title: 'Tools',
			render: (value) => (
				<Space size="middle">
					<Button
						onClick={() => setEditModalState({ rowData: value, isOpen: true })}
						disabled={!isEditMode}
						style={{ fontWeight: 400 }}
					>
						{translate('button.edit')}
					</Button>
					<Button disabled={!isEditMode} style={{ fontWeight: 400 }}>
						{translate('button.delete')}
					</Button>
				</Space>
			),
		},
	];

	return (
		<SectionWrapper>
			<>
				<SectionTitle
					title={translate('collab-section.title')}
					text={[translate('collab-section.description1'), translate('collab-section.note')]}
					showDivider={false}
				/>
				<SectionContent>
					<Table<CollabTableData>
						rowKey={(record: CollabTableData) => `PCGL-${record.id}`}
						columns={columns}
						dataSource={[
							{
								id: 1,
								firstName: 'John',
								lastName: 'Doe',
								institutionalEmail: 'thy.john.doe@oicr.ca',
								title: 'PI',
								suffix: 'Miss',
							},
						]}
						pagination={false}
					/>
					<Row justify={'end'}>
						<Col style={{ paddingTop: token.paddingLG }}>
							<Button
								onClick={() => setOpenAddCollaboratorModal(true)}
								style={{ borderRadius: 100 }}
								type="primary"
								disabled={!isEditMode}
							>
								<Flex align="center" justify="center" gap={'small'}>
									<PlusCircleOutlined />
									{translate('button.addCollab')}
								</Flex>
							</Button>
						</Col>
					</Row>
				</SectionContent>
				<AddCollaboratorModal isOpen={openAddCollaboratorModal} setIsOpen={setOpenAddCollaboratorModal} />
				<EditCollaboratorModal editState={editModalState} setIsOpen={setEditModalState} />
				<SectionFooter currentRoute="collaborators" isEditMode={isEditMode} />
			</>
		</SectionWrapper>
	);
};

export default Collaborators;
