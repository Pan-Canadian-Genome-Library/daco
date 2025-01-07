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

import { Application } from '@pcgl-daco/data-model';

import { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import { SkeletonLoader } from '@/components/SkeletonLoader';

type ApplicationViewerProps = {
	isEditMode: boolean;
	data: Application | undefined;
	loading: boolean;
};

function ApplicationViewer({ isEditMode, data, loading }: ApplicationViewerProps) {
	return (
		<Content>
			<Row style={{ ...contentWrapperStyles }}>
				{loading ? (
					//Loading state.
					//TODO: Temporary, but we should make this look pretty.
					<SkeletonLoader />
				) : (
					<Col>
						<p>
							Mode is: <strong>{isEditMode ? ' Edit Mode' : ' View Mode'}</strong>
						</p>
						<h1>PCGL-{data.id}</h1>
						<h2>Application Created - {data.created_at.toLocaleString('en-CA')}</h2>
						<p>Not set up yet.</p>
					</Col>
				)}
			</Row>
		</Content>
	);
}

export default ApplicationViewer;
