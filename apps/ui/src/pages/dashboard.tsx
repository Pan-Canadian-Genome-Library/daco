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

import { Col, Flex, Layout, Row } from 'antd';

import ApplicationStatusBar from '@/components/ApplicationStatusBar';
import ApplicationCard from '@/components/cards/ApplicationCard';
import NewApplicationCard from '@/components/cards/NewApplicationCard';
import ContentWrapper from '@/components/layouts/ContentWrapper';
import { applications } from '@/components/mock/applicationMockData';

const { Content } = Layout;

const DashboardPage = () => {
	return (
		<Content>
			<Flex style={{ height: '100%' }} vertical>
				<ApplicationStatusBar />
				<ContentWrapper style={{ padding: 40 }}>
					<Row style={{ width: '100%' }} gutter={[48, 48]} align={'middle'} justify={'center'}>
						{applications.length > 0 ? (
							<>
								<Col span={12}>
									<NewApplicationCard />
								</Col>
								{applications.map((applicationItem) => {
									return (
										<Col key={applicationItem.id} span={12}>
											<ApplicationCard {...applicationItem} />
										</Col>
									);
								})}
							</>
						) : (
							<Col span={12}>
								<NewApplicationCard />
							</Col>
						)}
					</Row>
				</ContentWrapper>
			</Flex>
		</Content>
	);
};

export default DashboardPage;
