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

import { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { Application } from '@pcgl-daco/data-model';
import { Col, Row, Skeleton } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

type ApplicationViewerProps = {
	isEditMode: boolean;
};

function ApplicationViewer({ isEditMode }: ApplicationViewerProps) {
	const params = useParams();
	const navigate = useNavigate();
	const [applicationData, setApplicationData] = useState<Application | undefined>(undefined);
	const [error, setError] = useState<ServerError | undefined>(undefined);

	const getApplicationData = async (id: string) => {
		const data = await fetch(`/applications/${id}`);
		if (data.ok) {
			return await data.json();
		} else {
			if (data.status === 404) {
				//TODO: Might be a good idea to display some type of 404 page, or forward to a standard 404 page
				// might also be a good idea when we eventually send out 401 / 403 errors.
				setError({
					message: 'Application not found.',
					errors: 'This application does not exist',
				});
			} else {
				setError({
					message: 'Something went wrong.',
					errors: data.statusText,
				});
			}
		}
	};

	useEffect(() => {
		const id = params.id;
		if (id !== undefined) {
			const data = getApplicationData(id);
			data
				.then((data: Application) => setApplicationData(data))
				.catch((error: TypeError) => {
					setError({
						message: 'Unable to talk to API',
						errors: `Failed to get applications, please check your internet connection. - ${error.message}`,
					});
				});
		} else {
			navigate('/dashboard');
		}
	}, [params.id, navigate]);

	return (
		<Content>
			<Row style={{ ...contentWrapperStyles }}>
				{applicationData ? (
					<Col>
						<p>
							Mode is: <strong>{isEditMode ? ' Edit Mode' : ' View Mode'}</strong>
						</p>
						<h1>PCGL-{applicationData.id}</h1>
						<h2>Application Created - {applicationData.created_at.toLocaleString('en-CA')}</h2>
						<p>Not set up yet.</p>
					</Col>
				) : error === undefined ? (
					//Loading state.
					//TODO: Temporary, but we should make this look pretty.
					<Skeleton loading />
				) : (
					<Col>
						<h1>{error.message}</h1>
						<h2>{error.errors}</h2>
					</Col>
				)}
			</Row>
		</Content>
	);
}

export default ApplicationViewer;
