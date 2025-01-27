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

import * as z from 'zod';

export type ApplicantInformationType = {
	applicantTitle: string;
	applicantFirstName: string;
	applicantMiddleName: string;
	applicantLastName: string;
	applicantSuffix: string;
	applicantPrimaryAffiliation: string;
	applicantInstituteAffiliation: string;
	applicantProfileUrl: string;
	applicantPositionTitle: string;
	institutionCountry: string;
	institutionState: string;
	institutionCity: string;
	institutionStreetAddress: string;
	institutionPostalCode: string;
	institutionBuilding: string;
};

export const applicantInformationSchema = z.object({
	applicantTitle: z.string({ message: 'Please fill out the required field' }),
	applicantFirstName: z
		.string({ message: 'Please fill out the required field' })
		.min(2, { message: 'Must bet at least 2 characters long' }),
	applicantLastName: z
		.string({ message: 'Please fill out the required field' })
		.min(2, { message: 'Must bet at least 2 characters long' }),
	applicantPrimaryAffiliation: z.string({ message: 'Please fill out the required field' }),
	applicantInstituteAffiliation: z
		.string({ message: 'Please fill out the required field' })
		.email({ message: 'Please enter a valid email address.' }),
	applicantProfileUrl: z
		.string({ message: 'Please fill out the required field' })
		.url({ message: 'Please enter a valid Url address.' })
		.refine((val) => val.startsWith('https://') || val.startsWith('http://'), {
			message: 'Please enter a valid url. Must begin with http:// or https://.',
			path: ['url'],
		}),
	applicantPositionTitle: z.string({ message: 'Please fill out the required field' }),
	institutionCountry: z.string({ message: 'Please fill out the required field' }),
	institutionState: z.string({ message: 'Please fill out the required field' }),
	institutionCity: z.string({ message: 'Please fill out the required field' }),
	institutionPostalCode: z.string({ message: 'Please fill out the required field' }),
	institutionStreetAddress: z.string({ message: 'Please fill out the required field' }),
});
