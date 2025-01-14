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

import { Route, Routes } from 'react-router';

import PageLayout from '@/components/layouts/PageLayout';
import ApplicationViewer from '@/pages/applications';
import Applicant from '@/pages/applications/sections/applicant';
import Introduction from '@/pages/applications/sections/intro';
import DashboardPage from '@/pages/dashboard';
import HomePage from '@/pages/index';
import ManageApplicationsPage from '@/pages/manage/applications';

function App() {
	return (
		<Routes>
			<Route element={<PageLayout />}>
				<Route index element={<HomePage />} />
				<Route path="dashboard" element={<DashboardPage />} />
				<Route path="application/:id" element={<ApplicationViewer />}>
					<Route path="intro/edit?" element={<Introduction />} />
					<Route path="applicant/edit?" element={<Applicant />} />
				</Route>
				<Route path="manage/applications" element={<ManageApplicationsPage />} />
			</Route>
		</Routes>
	);
}

export default App;
