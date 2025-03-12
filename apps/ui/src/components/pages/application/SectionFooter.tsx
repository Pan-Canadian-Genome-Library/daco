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

import useEditApplication from '@/api/useEditApplication';
import { ApplicationOutletContext } from '@/global/types';
import { ApplicationSectionRoutes } from '@/pages/AppRouter';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { Button, Flex, theme } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext, useParams } from 'react-router';

const { useToken } = theme;

type SectionFooterProps = {
	currentRoute: string;
	isEditMode: boolean;
};

const SectionFooter = ({ currentRoute, isEditMode }: SectionFooterProps) => {
	const { token } = useToken();
	const { t: translate } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams();
	const { mutate: editApplication } = useEditApplication();
	const { state } = useApplicationContext();
	const { appId } = useOutletContext<ApplicationOutletContext>();

	// Determine the next and previous route
	const { previousRoute, nextRoute } = useMemo(() => {
		for (let x = 0; x < ApplicationSectionRoutes.length; x++) {
			if (ApplicationSectionRoutes[x]?.route === currentRoute) {
				return {
					previousRoute: ApplicationSectionRoutes[x - 1]?.route,
					nextRoute: ApplicationSectionRoutes[x + 1]?.route,
				};
			}
		}
		return { previousRoute: undefined, nextRoute: undefined };
	}, [currentRoute]);

	const goBack = () => {
		if (state?.formState?.isDirty) {
			editApplication({ id: appId });
		}
		navigate(`/application/${id}/${previousRoute}/${isEditMode ? 'edit' : ''}`, { replace: true });
	};

	const nextSection = () => {
		if (state?.formState?.isDirty) {
			editApplication({ id: appId });
		}
		navigate(`/application/${id}/${nextRoute}/${isEditMode ? 'edit' : ''}`, { replace: true });
	};

	const submitApplication = () => {
		// Temp logic to trigger validation errors on ui edit mode

		console.log('Submit application');
	};

	return (
		<Flex style={{ marginTop: token.marginMD }} justify="flex-end" gap={'middle'}>
			{previousRoute ? (
				<Button onClick={goBack} type="default">
					{translate('button.back')}
				</Button>
			) : null}
			{nextRoute ? (
				<Button htmlType="submit" onClick={nextSection} type="primary">
					{translate('button.next')}
				</Button>
			) : (
				<Button onClick={submitApplication} type="primary">
					{translate('button.submitApplication')}
				</Button>
			)}
		</Flex>
	);
};

export default SectionFooter;
