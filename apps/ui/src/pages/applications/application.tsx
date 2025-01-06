/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { Col, Flex, Layout, Row, Typography } from 'antd';
import { Outlet, useParams } from 'react-router';

import useGetApplication from '@/api/useGetApplication';
import ContentWrapper from '@/components/layouts/ContentWrapper';
import AppHeader from '@/components/pages/application/AppHeader';
import SectionMenu from '@/components/pages/application/SectionMenu';
import { SkeletonLoader } from '@/components/SkeletonLoader';

const { Content } = Layout;
const { Text } = Typography;

const ApplicationViewer = () => {
	const params = useParams();
	const { data, isError, error, isLoading } = useGetApplication(params.id);

	// Could probably create a component to make it look nicer here
	if (isLoading) return <SkeletonLoader />;
	if (isError)
		return (
			<Content>
				<Flex style={{ height: '100%' }} vertical justify="center" align="center">
					<Text>{error.name}</Text>
					<Text>{error.message}</Text>
				</Flex>
			</Content>
		);
	return (
		<Content>
			<Flex style={{ height: '100%' }} vertical>
				<AppHeader id={data.id} />
				{/* Multipart form Viewer */}
				<ContentWrapper style={{ minHeight: '70vh', padding: '2em 0', gap: '3rem' }}>
					<>
						<Row style={{ width: '25%' }}>
							<Col style={{ width: '100%' }}>
								<SectionMenu />
							</Col>
						</Row>
						<Row style={{ width: '75%' }}>
							<Col style={{ background: 'white', width: '100%' }}>
								<Outlet />
							</Col>
						</Row>
					</>
				</ContentWrapper>
			</Flex>
		</Content>
	);
};

export default ApplicationViewer;
