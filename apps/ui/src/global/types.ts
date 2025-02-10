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

import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';
import { RuleRender } from 'antd/es/form';
import { ReactNode } from 'react';

export interface Application {
	id: string;
	userId: string;
	state: ApplicationStateValues;
	createdAt: string;
	approvedAt: string;
	updatedAt: string;
	expiresAt: string;
}
export interface ApplicationWithApplicantInformation extends Application {
	applicantInformation: {
		createdAt: string;
		firstName: string;
		lastName: string;
		email: string;
		country: string;
		institution: string;
	};
}

export interface ApplicationCountMetadata {
	DRAFT: number;
	INSTITUTIONAL_REP_REVIEW: number;
	INSTITUTIONAL_REP_REVISION_REQUESTED: number;
	DAC_REVIEW: number;
	DAC_REVISIONS_REQUESTED: number;
	REJECTED: number;
	APPROVED: number;
	CLOSED: number;
	REVOKED: number;
	TOTAL: number;
}

export interface PagingMetadata {
	totalRecords: number;
	page: number;
	pageSize: number;
}

export interface ApplicationList {
	applications: ApplicationWithApplicantInformation[];
	pagingMetadata: PagingMetadata;
}

export interface ServerError {
	message: string;
	errors?: string;
}

export interface FetchError extends ServerError {
	isError: true;
	statusCode: number;
}

export interface ApplicationOutletContext {
	appId: string | number;
	isEditMode: boolean;
}

export interface BasicFormFieldProps {
	label?: string | ReactNode;
	rule: RuleRender;
	required?: boolean;
}
