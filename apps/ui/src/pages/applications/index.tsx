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

import { Col, Flex, Layout, Row } from 'antd';
import { useEffect } from 'react';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router';

import ContentWrapper from '@/components/layouts/ContentWrapper';
import AppHeader from '@/components/pages/application/AppHeader';
import SectionMenu from '@/components/pages/application/SectionMenu';

import useGetApplication from '@/api/useGetApplication';
import ErrorPage from '@/components/pages/ErrorPage';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { ApplicationContentsResponse } from '@pcgl-daco/data-model';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types';

const { Content } = Layout;

const ApplicationViewer = () => {
	const params = useParams();
	const navigation = useNavigate();
	const { dispatch } = useApplicationContext();

	// grab current route and its relevant information
	const match = useMatch('application/:id/:section/:edit?');
	const isEditMode = !!match?.params.edit;
	const currentSection = match?.params.section ?? `intro${isEditMode ? '/edit' : ''}`;

	const { data, isError, error, isLoading } = useGetApplication(params.id);

	useEffect(() => {
		if (data && !('isError' in data)) {
			/**
			 * This likely means that the user directly linked the edit page somehow
			 * when the application was no longer in DRAFT mode. We redirect back to
			 * the view mode as protection.
			 *
			 * In the future, this should also check user ability (can they edit?)
			 */
			if (data.state !== ApplicationStates.DRAFT && isEditMode) {
				navigation(`/application/${data.id}/`, { replace: true });
			}
		}
	}, [data, isEditMode, navigation]);

	useEffect(() => {
		// Filter out data if they contain null values
		if (data && data.contents) {
			console.log('ja', data && data.contents);
			const fields = Object.entries(data.contents).reduce((acc, [key, value]) => {
				if (value !== null) {
					acc[key as keyof ApplicationContentsResponse] = value;
				}
				return acc;
			}, {} as Partial<ApplicationContentsResponse>);
			dispatch({ type: 'UPDATE_APPLICATION', payload: { fields } });
		}
	}, [data, dispatch]);

	if (!data || isError || isLoading) return <ErrorPage loading={isLoading} error={error} />;

	return (
		<Content>
			<Flex style={{ height: '100%' }} vertical>
				<AppHeader id={data.id} state={data.state} />
				{/* Multipart form Viewer */}
				<ContentWrapper style={{ minHeight: '70vh', padding: '2em 0', gap: '3rem' }}>
					<>
						<Row style={{ width: '25%' }}>
							<Col style={{ width: '100%' }}>
								<SectionMenu currentSection={currentSection} isEditMode={isEditMode} />
							</Col>
						</Row>
						<Row style={{ width: '75%' }}>
							<Col style={{ background: 'white', width: '100%' }}>
								<Outlet
									context={{
										appId: data.id,
										isEditMode,
									}}
								/>
							</Col>
						</Row>
					</>
				</ContentWrapper>
			</Flex>
		</Content>
	);
};

export default ApplicationViewer;
