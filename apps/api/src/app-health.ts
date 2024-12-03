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

export type AppHealth = {
	all: ComponentStatus;
	db: ComponentStatus;
};

// source: https://unicode.org/Public/emoji/12.0/emoji-test.txt
export enum Status {
	OK = '😇',
	UNKNOWN = '🤔',
	ERROR = '😱',
}

export type ComponentStatus = {
	status: Status;
	statusText?: 'OK' | 'N/A' | 'ERROR';
	info?: { err: unknown };
};

const health: AppHealth = {
	all: {
		status: Status.UNKNOWN,
		statusText: 'N/A',
	},
	db: {
		status: Status.UNKNOWN,
		statusText: 'N/A',
	},
};

export function setStatus(component: keyof AppHealth, status: ComponentStatus) {
	if (status.status === Status.OK) {
		status.statusText = 'OK';
	}
	if (status.status === Status.UNKNOWN) {
		status.statusText = 'N/A';
	}
	if (status.status === Status.ERROR) {
		status.statusText = 'ERROR';
	}
	health[component] = status;
	for (const k in health) {
		const key = k as keyof AppHealth;
		if (key === 'all') {
			continue;
		}
		if (health[key].status === Status.ERROR) {
			health['all'].status = Status.ERROR;
			health['all'].statusText = 'ERROR';
			return;
		}
		if (health[key].status === Status.UNKNOWN) {
			health['all'].status = Status.UNKNOWN;
			health['all'].statusText = 'N/A';
			return;
		}
	}
	health['all'].status = Status.OK;
	health['all'].statusText = 'OK';
}

export function getHealth(): AppHealth {
	return health;
}
