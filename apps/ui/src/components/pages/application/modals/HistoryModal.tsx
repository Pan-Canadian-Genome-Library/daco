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

import { type ApplicationHistoryResponseData } from '@pcgl-daco/data-model';
import { Button, Flex, Modal, Timeline, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import useGetApplication from '@/api/queries/useGetApplication';
import useGetApplicationHistory from '@/api/queries/useGetApplicationHistory';
import { pcglColours } from '@/providers/ThemeProvider';

const { Text } = Typography;

interface HistoryModalProps {
	id: number;
	isOpen: boolean;
	closeModal: () => void;
}

const TimelineDot = (
	<div
		style={{
			border: `3px solid ${pcglColours.primary}`,
			borderRadius: '100%',
			height: '0.75em',
			width: '0.75em',
		}}
	/>
);

const HistoryTimeline = ({ historyData }: { historyData: ApplicationHistoryResponseData }) => {
	const { t: translate } = useTranslation();
	const timelineHistoryItems = historyData.map((item) => ({
		dot: TimelineDot,
		children: (
			<span>
				<Text strong>{translate(`modals.history.actions.${item.action}`)}</Text>
				<Text>
					{translate('modals.history.timelineItem', {
						userName: item.userId,
						actionDate: new Date(item.createdAt).toDateString(),
					})}
				</Text>
			</span>
		),
	}));

	return <Timeline items={timelineHistoryItems} />;
};

const HistoryModal = ({ id, isOpen, closeModal }: HistoryModalProps) => {
	const {
		data: applicationData,
		isError: isApplicationError,
		error: applicationError,
		isLoading: isApplicationLoading,
	} = useGetApplication(id);
	const {
		data: historyData,
		isError: isHistoryError,
		error: historyError,
		isLoading: isHistoryLoading,
	} = useGetApplicationHistory(id, isOpen);
	const { t: translate } = useTranslation();
	console.log('history data', historyData);
	const displayId = `PCGL-${id}`;
	const lastUpdated = applicationData?.updatedAt ? new Date(applicationData.updatedAt).toDateString() : '';
	const submissionDate = applicationData?.createdAt ? new Date(applicationData.createdAt).toDateString() : '';

	const isError = isApplicationError || isHistoryError;
	const isLoading = isApplicationLoading || isHistoryLoading;
	const isNotFound = historyData !== undefined && historyData.length === 0;
	const isHistoryLoaded = !isLoading && !isError && !isNotFound;

	return (
		<Modal
			closeIcon={true}
			destroyOnClose
			footer={[]}
			loading={isLoading}
			onCancel={closeModal}
			onOk={closeModal}
			open={isOpen}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			title={translate('modals.history.title')}
			width={'100%'}
		>
			<Flex justify="start" align="top" vertical>
				{isHistoryLoaded ? (
					<>
						<div style={{ marginBottom: '2em' }}>
							<div>
								<Text strong>{translate('modals.history.applicationId')}:</Text>
								<Text> {displayId}</Text>
							</div>
							<div>
								<Text strong>{translate('modals.history.submissionDate')}:</Text>
								<Text> {submissionDate}</Text>
							</div>
							<div>
								<Text strong>{translate('modals.history.currentStatus')}:</Text>
								<Text> {translate(`application.states.${applicationData?.state}`)}</Text>
							</div>
							<div>
								<Text strong>{translate('modals.history.lastUpdated')}:</Text>
								<Text> {lastUpdated}</Text>
							</div>
						</div>
						<HistoryTimeline historyData={historyData || []} />
					</>
				) : (
					<Text style={{ margin: '1em 0' }}>
						{isNotFound
							? translate('modals.history.notFound')
							: isHistoryError
								? historyError?.error
								: applicationError?.error}
					</Text>
				)}
				<Button style={{ width: '10%', alignSelf: 'end' }} type="primary" onClick={closeModal}>
					{translate('modals.buttons.close')}
				</Button>
			</Flex>
		</Modal>
	);
};

export default HistoryModal;
