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

interface HistoryModalProps {
	id: number;
	isOpen: boolean;
	onOk: () => void;
	okText: string;
}

const HistoryModal = ({ id, isOpen, onOk, okText }: HistoryModalProps) => {
	const applicationResponse = useGetApplication(id);

	// TODO: Validation
	const displayId = `PCGL-${id}`;

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
				<Title level={3} aria-level={1} style={{ marginTop: '0.5em' }}>
					Application History
				</Title>
				<div style={{ marginBottom: '2em' }}>
					<p style={{ margin: 0 }}>
						<span style={{ fontWeight: 'bold' }}>Application ID:</span> {displayId}
					</p>
					<p style={{ margin: 0 }}>
						<span style={{ fontWeight: 'bold' }}>Submission Date:</span> {`${applicationResponse.data?.updatedAt}`}{' '}
					</p>
					<p style={{ margin: 0 }}>
						<span style={{ fontWeight: 'bold' }}>Current Status:</span> {applicationResponse.data?.state}
					</p>
					<p style={{ margin: 0 }}>
						<span style={{ fontWeight: 'bold' }}>Last Updated: </span>
						{`${applicationResponse.data?.updatedAt}`}
					</p>
				</div>
				<Button type="primary" onClick={onOk}>
					{okText}
				</Button>
			</Flex>
		</Modal>
	);
};

export default HistoryModal;
