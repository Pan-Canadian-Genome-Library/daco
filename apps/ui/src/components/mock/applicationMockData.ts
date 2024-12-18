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

// TODO: test data, subject to change

import { Application } from '@/global/types';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types';

export const mockUserID = 'testUser@oicr.on.ca';

export const applications: Application[] = [
	{
		id: '123',
		userId: 'user-123',
		state: ApplicationStates.DRAFT,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '436',
		userId: 'user-151',
		state: ApplicationStates.DAC_REVIEW,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '7685',
		userId: 'user-111',
		state: ApplicationStates.APPROVED,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '143',
		userId: 'user-231',
		state: ApplicationStates.REJECTED,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '543453',
		userId: 'user-554',
		state: ApplicationStates.CLOSED,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
];
