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

import { actions } from './schemas/actions.ts';
import { agreements } from './schemas/agreements.ts';
import { applicationContents } from './schemas/applicationContents.ts';
import { applications } from './schemas/applications.ts';
import { collaborators } from './schemas/collaborators.ts';
import { files } from './schemas/files.ts';
import { revisionRequests } from './schemas/revisionRequests.ts';

async function testActions() {
	console.log('actions', actions);
}

async function testAgreements() {
	console.log('agreements', agreements);
}

async function testApplications() {
	console.log('applications', applications);
}

async function testApplicationContents() {
	console.log('application contents', applicationContents);
}

async function testCollaborators() {
	console.log('collaborators', collaborators);
}

async function testFiles() {
	console.log('files', files);
}

async function testRevisions() {
	console.log('revisions', revisionRequests);
}

async function testDb() {
	try {
		await testActions();
		await testAgreements();
		await testApplications();
		await testApplicationContents();
		await testCollaborators();
		await testFiles();
		await testRevisions();
	} catch (err) {
		console.error('Error at TestDb');
		console.error(err);
	}
	process.exit();
}

await testDb();
