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

import { Navigate, Route, Routes } from 'react-router';

import { SectionRoutes, SectionRoutesValues } from '@pcgl-daco/validation';

import PageLayout from '@/components/layouts/PageLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ApplicationViewer from '@/pages/applications';
import AccessAgreement from '@/pages/applications/sections/access';
import Appendices from '@/pages/applications/sections/appendices';
import Applicant from '@/pages/applications/sections/applicant';
import Collaborators from '@/pages/applications/sections/collaborators';
import Ethics from '@/pages/applications/sections/ethics';
import Institutional from '@/pages/applications/sections/institutional';
import Introduction from '@/pages/applications/sections/intro';
import Project from '@/pages/applications/sections/project';
import RequestedStudy from '@/pages/applications/sections/requestedStudy';
import SignAndSubmit from '@/pages/applications/sections/sign';
import DashboardPage from '@/pages/dashboard';
import HomePage from '@/pages/index';
import LoginError from '@/pages/login/error';
import LoginRedirect from '@/pages/login/redirect';
import ManageApplicationsPage from '@/pages/manage/applications';
import NotFound from '@/pages/NotFound';
import InstitutionalRepLogin from '@/pages/review';
import { ApplicationContextProvider } from '@/providers/context/application/ApplicationContextProvider';

export interface ApplicationSectionRouteTypes {
	route: SectionRoutesValues;
	path: string;
	element: React.ReactElement;
}

export const ApplicationSectionRoutes: ApplicationSectionRouteTypes[] = [
	{
		route: SectionRoutes.INTRO,
		path: `${SectionRoutes.INTRO}/edit?`,
		element: <Introduction />,
	},
	{
		route: SectionRoutes.APPLICANT,
		path: `${SectionRoutes.APPLICANT}/edit?`,
		element: <Applicant />,
	},
	{
		route: SectionRoutes.INSTITUTIONAL,
		path: `${SectionRoutes.INSTITUTIONAL}/edit?`,
		element: <Institutional />,
	},
	{
		route: SectionRoutes.COLLABORATORS,
		path: `${SectionRoutes.COLLABORATORS}/edit?`,
		element: <Collaborators />,
	},
	{
		route: SectionRoutes.PROJECT,
		path: `${SectionRoutes.PROJECT}/edit?`,
		element: <Project />,
	},
	{
		route: SectionRoutes.STUDY,
		path: `${SectionRoutes.STUDY}/edit?`,
		element: <RequestedStudy />,
	},
	{
		route: SectionRoutes.ETHICS,
		path: `${SectionRoutes.ETHICS}/edit?`,
		element: <Ethics />,
	},
	{
		route: SectionRoutes.AGREEMENT,
		path: `${SectionRoutes.AGREEMENT}/edit?`,
		element: <AccessAgreement />,
	},
	{
		route: SectionRoutes.APPENDICES,
		path: `${SectionRoutes.APPENDICES}/edit?`,
		element: <Appendices />,
	},
	{
		route: SectionRoutes.SIGN,
		path: `${SectionRoutes.SIGN}/edit?`,
		element: <SignAndSubmit />,
	},
];

function AppRouter() {
	return (
		<Routes>
			<Route element={<PageLayout />}>
				<Route path="login/redirect" element={<LoginRedirect />} />
				<Route path="login/error/*" element={<LoginError />} />

				<Route index element={<HomePage />} />
				<Route
					path="dashboard"
					element={
						<ProtectedRoute requiredRoles={['APPLICANT']} redirectTo={'/login/redirect/'}>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="application/:id"
					element={
						<ProtectedRoute>
							<ApplicationContextProvider>
								<ApplicationViewer />
							</ApplicationContextProvider>
						</ProtectedRoute>
					}
				>
					<Route index element={<Navigate to="intro" replace />} />
					{/* Application Section Routes */}
					{ApplicationSectionRoutes.map((item) => (
						<Route key={item.route} path={item.path} element={item.element} />
					))}
				</Route>
				<Route
					path="manage/applications"
					element={
						<ProtectedRoute requiredRoles={['DAC_MEMBER', 'DAC_CHAIR']} redirectTo={'/login/redirect/'}>
							<ManageApplicationsPage />
						</ProtectedRoute>
					}
				/>
				<Route path="review/:applicationId" element={<InstitutionalRepLogin />} />

				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}

export default AppRouter;
