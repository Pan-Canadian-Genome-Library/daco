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

import useGetCollaborators from '@/api/queries/useGetCollaborators';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import AddCollaboratorModal from '@/components/pages/application/modals/AddCollaboratorModal';
import DeleteCollaboratorModal from '@/components/pages/application/modals/DeleteCollaboratorModal';
import EditCollaboratorModal from '@/components/pages/application/modals/EditCollaboratorModal';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import ErrorPage from '@/components/pages/ErrorPage';
import { ApplicationOutletContext } from '@/global/types';
import { type CollaboratorsResponse } from '@pcgl-daco/data-model';

const { useToken } = theme;

export interface ModalState {
	rowData?: CollaboratorsResponse;
	isOpen: boolean;
}

export interface ModalStateProps extends ModalState {
	setIsOpen: (props: ModalState) => void;
}

const Collaborators = () => {
	const { t: translate } = useTranslation();
	const { appId, isEditMode } = useOutletContext<ApplicationOutletContext>();
	const { token } = useToken();
	const { data, isLoading, isError } = useGetCollaborators(appId);

	// MODAL STATES
	const [addModalState, setAddModalState] = useState<ModalState>({ isOpen: false });
	const [deleteModalState, setDeleteModalState] = useState<ModalState>({ isOpen: false });
	const [editModalState, setEditModalState] = useState<ModalState>({ isOpen: false });

	const columns: TableProps<CollaboratorsResponse>['columns'] = [
		{
			key: 'collaboratorFirstName',
			title: 'First Name',
			dataIndex: 'collaboratorFirstName',
		},
		{
			key: 'collaboratorLastName',
			title: 'Last Name',
			dataIndex: 'collaboratorLastName',
		},
		{
			key: 'collaboratorInstitutionalEmail',
			title: 'Institutional Email',
			dataIndex: 'collaboratorInstitutionalEmail',
		},
		{
			key: 'collaboratorPositionTitle',
			title: 'Position Title',
			dataIndex: 'collaboratorPositionTitle',
		},
		{
			key: 'tools',
			title: 'Tools',
			render: (value) => {
				return (
					<Space size="middle">
						<Button
							onClick={() => setEditModalState({ rowData: value, isOpen: true })}
							disabled={!isEditMode}
							style={{ fontWeight: 400 }}
						>
							{translate('button.edit')}
						</Button>
						<Button
							onClick={() => setDeleteModalState({ rowData: value, isOpen: true })}
							disabled={!isEditMode}
							style={{ fontWeight: 400 }}
						>
							{translate('button.delete')}
						</Button>
					</Space>
				);
			},
		},
	];

	// ? TODO: make a nicer error/loading page with patrick
	if (!data || isLoading || isError) {
		return <ErrorPage loading={isLoading} error={null} />;
	}

	return (
		<SectionWrapper>
			<>
				<SectionTitle
					title={translate('collab-section.title')}
					text={[
						translate('collab-section.description1'),
						translate('collab-section.optional'),
						translate('collab-section.note'),
					]}
					showDivider={false}
				/>
				<SectionContent showDivider={false}>
					<Table rowKey={(record) => `PCGL-${record.id}`} columns={columns} dataSource={data} pagination={false} />
					<Row justify={'end'}>
						<Col style={{ paddingTop: token.paddingLG }}>
							<Button
								onClick={() => setAddModalState({ isOpen: true })}
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
				<AddCollaboratorModal isOpen={addModalState.isOpen} setIsOpen={setAddModalState} />
				<DeleteCollaboratorModal
					appId={appId}
					isOpen={deleteModalState.isOpen}
					rowData={deleteModalState.rowData}
					setIsOpen={setDeleteModalState}
				/>
				<EditCollaboratorModal
					rowData={editModalState.rowData}
					setIsOpen={setEditModalState}
					isOpen={editModalState.isOpen}
				/>
				<SectionFooter currentRoute="collaborators" isEditMode={isEditMode} />
			</>
		</SectionWrapper>
	);
};

export default Collaborators;
