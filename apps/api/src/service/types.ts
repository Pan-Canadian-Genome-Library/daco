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

import { actions } from '@/db/schemas/actions.js';
import { applicationContents } from '@/db/schemas/applicationContents.js';
import { applications } from '@/db/schemas/applications.js';
import actionService from '@/service/action-service.js';
import applicationService from '@/service/application-service.js';

export type ApplicationsColumnName = keyof typeof applications.$inferSelect;
export type ActionsColumnName = keyof typeof actions.$inferSelect;
export type SchemaKeys = ApplicationsColumnName | ActionsColumnName;

export type ApplicationContentUpdates = Partial<typeof applicationContents.$inferInsert>;

export type ApplicationData = typeof applications.$inferSelect;
export type ActionData = typeof actions.$inferSelect;

export type ApplicationService = ReturnType<typeof applicationService>;
export type ActionService = ReturnType<typeof actionService>;

export type ApplicationUpdates = Partial<typeof applications.$inferInsert>;

export type OrderBy<Key extends SchemaKeys> = {
	direction: 'asc' | 'desc';
	column: Key;
};
