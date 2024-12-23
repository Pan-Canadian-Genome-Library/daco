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

import { mockUserID } from '@/components/mock/applicationMockData';
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { Application } from '@pcgl-daco/data-model/src/types';
import { Button, Card, Flex, notification, theme, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const { Title } = Typography;
const { useToken } = theme;

const NewApplicationCard = () => {
	const { t: translate } = useTranslation();
	const { token } = useToken();
	const navigation = useNavigate();
	const [error, setError] = useState<ServerError | undefined>(undefined);

	useEffect(() => {
		if (error) {
			notification.error({
				message: error.message,
				description: error.errors,
			});
		}
	}, [error]);

	const createApplication = async () => {
		try {
			const result = await fetch('/applications/create', {
				method: 'POST',
				body: JSON.stringify({
					//TODO: Replace this with the globally authenticated user once authentication is implemented;
					userId: mockUserID,
				}),
			});

			if (result.ok) {
				const applicationData = (await result.json()) as Application;
				return applicationData;
			} else {
				setError({
					message: translate('errors.generic.title'),
					errors: translate('errors.generic.message'),
				});
				return undefined;
			}
		} catch {
			setError({
				message: translate('errors.fetchError.title'),
				errors: translate('errors.fetchError.message'),
			});
			return undefined;
		}
	};

	const onGetStartedClick = async () => {
		const application = await createApplication();
		if (application && application.id && !error) {
			navigation(`/application/${application.id}/edit`);
		}
	};

	return (
		<Card style={{ backgroundColor: token.colorWhite, minHeight: 200, height: 200 }} hoverable>
			<Flex justify="center" align="center" vertical gap="middle">
				<Title level={3}>{translate('dashboard.startNewApp')}</Title>
				<Button color="default" variant="outlined" onClick={onGetStartedClick}>
					{translate('button.getStarted')}
				</Button>
			</Flex>
		</Card>
	);
};

export default NewApplicationCard;
