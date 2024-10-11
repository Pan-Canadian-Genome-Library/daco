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

import { type Application } from 'pcgl-daco/packages/types/src/types';
import { useState } from 'react';
import './App.css';

function App() {
	const [application, setApplication] = useState<Application | undefined>(
		undefined
	);

	const getApplication = async () => {
		const response = await fetch('http://localhost:3000/applications');
		const application: Application = await response.json();

		setApplication(application);
	};

	const applicantName = application
		? `${application.applicant.title}
	${application.applicant.first} ${application.applicant.middle}
	${application.applicant.last}`
		: '';
	return (
		<>
			<div>
				<img src={'./pcgl-logo.png'} className="logo" alt="PCGL Logo" />
			</div>
			<h1>Pan Canadian Genomic Library DACO</h1>
			<div className="card">
				<button onClick={() => getApplication()}>Start an Application</button>
			</div>
			{application && (
				<div className="card">
					<h2>{application.project_information.project_title}</h2>

					<h3>Applicant: {applicantName}</h3>
				</div>
			)}
		</>
	);
}

export default App;
