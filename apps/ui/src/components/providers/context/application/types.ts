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

import { Dispatch } from 'react';

export type ApplicationFieldsType = {
	applicantFirstName: string | null;
	applicantMiddleName: string | null;
	applicantLastName: string | null;
	applicantTitle: string | null;
	applicantSuffix: string | null;
	applicantPositionTitle: string | null;
	applicantPrimaryAffiliation: string | null;
	applicantInstitutionalEmail: string | null;
	applicantProfileUrl: string | null;
	institutionalRepTitle: string | null;
	institutionalRepFirstName: string | null;
	institutionalRepMiddleName: string | null;
	institutionalRepLastName: string | null;
	institutionalRepSuffix: string | null;
	institutionalRepPrimaryAffiliation: string | null;
	institutionalRepEmail: string | null;
	institutionalRepProfileUrl: string | null;
	institutionalRepPositionTitle: string | null;
	institutionCountry: string | null;
	institutionState: string | null;
	institutionCity: string | null;
	institutionStreetAddress: string | null;
	institutionPostalCode: string | null;
	institutionBuilding: string | null;
	projectTitle: string | null;
	projectWebsite: string | null;
	projectBackground: string | null;
	projectMethodology: string | null;
	projectAims: string | null;
	projectSummary: string | null;
};

export type ApplicationContextType = {
	state: ApplicationFieldsType;
	dispatch: Dispatch<ApplicationAction>;
};

export type ApplicationAction = { type: 'UPDATE_APPLICATION'; payload: ApplicationFieldsType };
