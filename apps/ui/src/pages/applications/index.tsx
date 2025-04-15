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
import ApplicationViewerHeader from '@/components/pages/application/ApplicationViewerHeader';
import SectionMenu from '@/components/pages/application/SectionMenu';

import useGetApplication from '@/api/queries/useGetApplication';
import useGetApplicationFeedback from '@/api/queries/useGetApplicationFeedback';
import ErrorPage from '@/components/pages/ErrorPage';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types';

const { Content } = Layout;

const ApplicationViewer = () => {
	const params = useParams();
	const navigation = useNavigate();

	// grab current route and its relevant information
	const match = useMatch('application/:id/:section/:edit?');
	const isEditMode = !!match?.params.edit;
	const currentSection = match?.params.section ?? `intro${isEditMode ? '/edit' : ''}`;

	const {
		data: applicationData,
		isError: applicationIsErrored,
		error: applicationError,
		isLoading: applicationIsLoading,
	} = useGetApplication(params.id);

	const {
		data: revisionsData,
		isError: revisionsIsErrored,
		error: revisionsError,
		isLoading: revisionsLoading,
	} = useGetApplicationFeedback(params.id);

	useEffect(() => {
		if (applicationData && !applicationError) {
			/**
			 * This likely means that the user directly linked the edit page somehow
			 * when the application was no longer in DRAFT mode. We redirect back to
			 * the view mode as protection.
			 *
			 * In the future, this should also check user ability (can they edit?)
			 */
			if (
				applicationData.state !== ApplicationStates.DRAFT &&
				applicationData.state !== ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED &&
				isEditMode
			) {
				navigation(`/application/${applicationData.id}/`, { replace: true });
			}
		}
	}, [applicationData, applicationError, isEditMode, navigation]);

	// scroll to top on page change
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [match]);

	if (
		!applicationData ||
		!revisionsData ||
		applicationIsErrored ||
		applicationIsLoading ||
		revisionsLoading ||
		revisionsIsErrored
	)
		return <ErrorPage loading={applicationIsLoading || revisionsLoading} error={applicationError || revisionsError} />;

	return (
		<Content>
			<Flex style={{ height: '100%' }} vertical>
				<ApplicationViewerHeader id={applicationData.id} state={applicationData.state} />
				{/* Multipart form Viewer */}
				<Flex style={{ width: '100%', paddingInline: '52px' }}>
					<ContentWrapper style={{ minHeight: '70vh', padding: '2em 0', gap: '3rem' }}>
						<>
							<Row style={{ width: '25%' }}>
								<Col style={{ width: '100%' }}>
									<SectionMenu
										appId={applicationData.id}
										currentSection={currentSection}
										isEditMode={isEditMode}
										revisions={revisionsData}
									/>
								</Col>
							</Row>
							<Row style={{ width: '75%' }}>
								<Col style={{ background: 'white', width: '100%' }}>
									<Outlet
										context={{
											appId: applicationData.id,
											isEditMode,
											revisions: revisionsData,
										}}
									/>
								</Col>
							</Row>
						</>
					</ContentWrapper>
				</Flex>
			</Flex>
		</Content>
	);
};

export default ApplicationViewer;
