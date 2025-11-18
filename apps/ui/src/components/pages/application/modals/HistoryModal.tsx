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

import { Button, Flex, Modal, Timeline, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import useGetApplication from '@/api/queries/useGetApplication';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { pcglColours } from '@/providers/ThemeProvider';

const { Title, Text } = Typography;

// TODO: Replace Mock Data
const displayHistoryItems = ['Submitted', 'Reviewed', 'Revoked', 'Approved'];

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

interface HistoryModalProps {
	id: number;
	isOpen: boolean;
	closeModal: () => void;
}

const HistoryModal = ({ id, isOpen, closeModal }: HistoryModalProps) => {
	// TODO: Replace Mock Data
	const { data: applicationData, isError, isLoading } = useGetApplication(id);
	const displayId = `PCGL-${id}`;
	const isHistoryLoaded = !isLoading && applicationData !== undefined && !isError;
	const lastUpdated = applicationData?.updatedAt ? new Date(applicationData.updatedAt).toDateString() : '';
	const submissionDate = applicationData?.createdAt ? new Date(applicationData.createdAt).toDateString() : '';
	const { t: translate } = useTranslation();

	// TODO: Replace Mock Data
	const timelineHistoryItems = displayHistoryItems.map((item) => ({
		dot: TimelineDot,
		children: (
			<span>
				<Text strong>{item}</Text>
				<Text>
					{translate('modals.history.timelineItem', {
						applicantFirstName: applicationData?.contents?.applicantFirstName,
						submissionDate,
					})}
				</Text>
			</span>
		),
	}));

	return (
		<Modal
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={isOpen}
			closeIcon={true}
			onClose={closeModal}
			onOk={closeModal}
			footer={[]}
			destroyOnClose
		>
			<Flex justify="start" align="top" vertical>
				<Title level={3} aria-level={1} style={{ marginTop: '0.5em', marginBottom: '1em' }}>
					{translate('modals.history.title')}
				</Title>
				{isLoading ? (
					<div style={{ margin: '1em 0' }}>
						<SkeletonLoader />
					</div>
				) : isHistoryLoaded ? (
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
								<Text> {applicationData.state}</Text>
							</div>
							<div>
								<Text strong>{translate('modals.history.lastUpdated')}:</Text>
								<Text> {lastUpdated}</Text>
							</div>
						</div>
						<Timeline items={timelineHistoryItems} style={{ padding: 0 }} />
					</>
				) : (
					<div style={{ margin: '1em 0' }}>{translate('modals.history.error')}</div>
				)}
				<Button style={{ width: '10%', alignSelf: 'end' }} type="primary" onClick={closeModal}>
					{translate('modals.buttons.close')}
				</Button>
			</Flex>
		</Modal>
	);
};

export default HistoryModal;
