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

import { Application } from '@pcgl-daco/data-model';
import { Col, Flex, Layout, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router';

import ContentWrapper from '@/components/layouts/ContentWrapper';
import AppHeader from '@/components/pages/application/AppHeader';
import SectionMenu from '@/components/pages/application/SectionMenu';
import ErrorPage from '@/components/pages/ErrorPage';
import { useGetData } from '@/global/hooks/useGetData';
import { FetchError, ServerError } from '@/global/types';
import { ApplicationStates } from '@pcgl-daco/data-model/dist/types';

const { Content } = Layout;

const ApplicationViewer = () => {
	const params = useParams();
	const navigation = useNavigate();
	const { t: translate } = useTranslation();
	const match = useMatch('/application/:id/:section/:edit');
	const isEditMode = !!match?.params.edit;

	const [applicationData, setApplicationData] = useState<Application | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ServerError | undefined>(undefined);

	const data = useGetData(`/applications/${params.id}`) as Application | FetchError;

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

			setApplicationData(data);
			setLoading(false);
		} else if (data && data.isError) {
			setLoading(false);

			setError({
				message: data.statusCode === 404 ? translate('errors.applicationNotFound.title') : data.message,
				errors: data.statusCode === 404 ? translate('errors.applicationNotFound.message') : data.errors,
			});
		}
	}, [data, isEditMode, navigation, translate]);

	// Should make a component for this
	if (!applicationData || error || loading) return <ErrorPage error={error} loading={loading} />;

	return (
		<Content>
			<Flex style={{ height: '100%' }} vertical>
				<AppHeader appId={applicationData.id} />
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
