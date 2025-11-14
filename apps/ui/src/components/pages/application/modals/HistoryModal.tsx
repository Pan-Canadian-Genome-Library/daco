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

import useGetApplication from '@/api/queries/useGetApplication';
import { Button, Flex, Modal, Typography } from 'antd';

const { Title } = Typography;

const displayHistoryItems = ['Submitted', 'Reviewed', 'Revoked', 'Approved'];

interface HistoryModalProps {
	id: number;
	isOpen: boolean;
	onOk: () => void;
	okText: string;
}

const HistoryModal = ({ id, isOpen, onOk, okText }: HistoryModalProps) => {
	const applicationResponse = useGetApplication(id);
	const applicationData = applicationResponse.data;
	// TODO: Validation
	const displayId = `PCGL-${id}`;
	const submissionDate = applicationData?.createdAt ? new Date(applicationData.createdAt).toDateString() : '';
	const lastUpdated = applicationData?.updatedAt ? new Date(applicationData.updatedAt).toDateString() : '';

	return (
		<Modal
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={isOpen}
			closeIcon={false}
			onOk={onOk}
			footer={[]}
			destroyOnClose
		>
			<Flex justify="start" align="top" vertical>
				<Title level={3} aria-level={1} style={{ marginTop: '0.5em', marginBottom: '1em' }}>
					Application History
				</Title>
				{applicationData ? (
					<>
						<div style={{ marginBottom: '2em' }}>
							<p style={{ margin: 0 }}>
								<span style={{ fontWeight: 'bold' }}>Application ID:</span> {displayId}
							</p>
							<p style={{ margin: 0 }}>
								<span style={{ fontWeight: 'bold' }}>Submission Date:</span> {`${submissionDate}`}
							</p>
							<p style={{ margin: 0 }}>
								<span style={{ fontWeight: 'bold' }}>Current Status:</span> {applicationData.state}
							</p>
							<p style={{ margin: 0 }}>
								<span style={{ fontWeight: 'bold' }}>Last Updated:</span> {`${lastUpdated}`}
							</p>
						</div>
						<div style={{ marginBottom: '2em' }}>
							{displayHistoryItems.map((item) => (
								<p style={{ display: 'flex', alignItems: 'center' }}>
									<div
										style={{
											border: '2px solid #C41D7F',
											borderRadius: '100%',
											display: 'inline-flex',
											height: '1em',
											width: '1em',
										}}
									/>
									<span style={{ fontWeight: 'bold', marginLeft: '1em' }}>{item}</span> by{' '}
									{applicationData.contents?.applicantFirstName} at {submissionDate}
								</p>
							))}
						</div>
					</>
				) : (
					<div style={{ margin: '1em 0' }}>Application Not Found</div>
				)}
				<Button type="primary" onClick={onOk}>
					{okText}
				</Button>
			</Flex>
		</Modal>
	);
};

export default HistoryModal;
