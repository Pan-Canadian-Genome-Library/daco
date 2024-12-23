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

import { Col, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { Application } from '@pcgl-daco/data-model';

import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';

import { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import { SkeletonLoader } from '@/components/SkeletonLoader';

type ApplicationViewerProps = {
	isEditMode: boolean;
};

function ApplicationViewer({ isEditMode }: ApplicationViewerProps) {
	const params = useParams();
	const [applicationData, setApplicationData] = useState<Application | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ServerError | undefined>(undefined);

	const getApplicationData = async (id: string) => {
		const data = await fetch(`/applications/${id}`);
		if (data.ok) {
			const results = (await data.json()) as Application;
			setApplicationData(results);
			setLoading(false);
		} else {
			setLoading(false);
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
		async function fetch(id: string | undefined) {
			if (id) {
				await getApplicationData(id);
			}
		}
		fetch(params.id);
	}, [params.id]);

	return (
		<Content>
			<Row style={{ ...contentWrapperStyles }}>
				{loading && !error ? (
					//Loading state.
					//TODO: Temporary, but we should make this look pretty.
					<SkeletonLoader />
				) : applicationData && !error ? (
					<Col>
						<p>
							Mode is: <strong>{isEditMode ? ' Edit Mode' : ' View Mode'}</strong>
						</p>
						<h1>PCGL-{applicationData.id}</h1>
						<h2>Application Created - {applicationData.created_at.toLocaleString('en-CA')}</h2>
						<p>Not set up yet.</p>
					</Col>
				) : (
					<Col>
						<h1>{error?.message}</h1>
						<h2>{error?.errors}</h2>
					</Col>
				)}
			</Row>
		</Content>
	);
}

export default ApplicationViewer;
