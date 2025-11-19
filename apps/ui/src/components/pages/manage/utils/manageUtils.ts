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

import { ApplicationCountMetadata } from '@/global/types';
import { isValidPageNumber } from '@/global/utils';
import { Key } from 'react';
import { FilterKeys, isFilterKey } from '../DashboardFilter';
import { FilterState } from '../ManagementDashboard';

/**
 * The default number of rows shown in the table, also known as PageSize
 */
export const DEFAULT_NUMBER_OF_ROWS = 20;

/**
 * Default filter that's selected on page load, or when an unknown configuration is encountered.
 */
export const DEFAULT_FILTER_STATE: FilterKeys = 'TOTAL';

/**
 * Used to translate between the key that represents each column, and
 * the names of the column's the API expects.
 * @param column The column object passed in by the `antd` table.
 * @returns A `ApplicationListSortingOptions` compatible column name.
 */
export const parseSortingOptions = (column: string | Key | readonly Key[]) => {
	let key = column;
	if (Array.isArray(column)) {
		key = column[column.length - 1];
	}

	switch (key) {
		case 'id':
			return 'id';
		case 'applicant':
			return 'user_id';
		case 'createdAt':
			return 'created_at';
		case 'approvedAt':
			return 'approved_at';
		case 'updatedAt':
			return 'updated_at';
		case 'expiresAt':
			return 'expires_at';
		case 'state':
			return 'state';
		default:
			return 'id';
	}
};

/**
 * Calculates the number shown beside the filter at the top of the page.
 * Example: 10 Total | 3 DAC Review, etc...
 * @param data The data provided via the backend `metadata/counts` endpoint.
 * @returns A `FilterState` object, containing the unique key of the filter and how many applications are filed under it.
 */
export const calculateFilterAmounts = (countMetadata: ApplicationCountMetadata): FilterState[] => {
	const availableStates: FilterState[] = [];
	for (const appState of Object.keys(countMetadata)) {
		if (isFilterKey(appState))
			availableStates.push({
				key: appState,
				amount: countMetadata[appState],
			});
	}
	return availableStates;
};

/**
 * Processes a page number passed into it, checking if it's valid, and if it needs to be converted into a int.
 *
 * Additionally, since page numbers on the server count from 0, whereas `antd` counts from 1, it can convert from
 * either or using the `forAPI` param.
 * @param pageNumber The current page that the user is on in the UI from the URL
 * @param forAPI If the processed page number you'd like back is being sent to the server (count from zero)
 * @returns A `number` that has been validated and converted.
 */
export const parsePageNumber = (pageNumber?: number | string | null, forAPI?: boolean): number => {
	if (pageNumber) {
		const parsedPage = typeof pageNumber === 'string' ? Number(pageNumber) : pageNumber;
		if (isValidPageNumber(parsedPage)) {
			return forAPI ? parsedPage - 1 : parsedPage;
		}
	}
	return forAPI ? 0 : 1;
};

/**
 * Gets and parses filters from the URL params. Given that the search param may be null or otherwise invalid
 * this function returns a normalized string array.
 *
 * @param rawFilters The raw string of filters from the query param.
 * @returns A standardized string array of potential filters.
 */
export const parseFilters = (rawFilters?: string | null): string[] => {
	if (rawFilters) {
		const decodedFilters = rawFilters.split(',');
		return decodedFilters;
	}
	return [];
};

/**
 * Checks if the set of filters passed into it are a part of the possible filters set.
 * @param appliedFilters A string array containing the filters passed in via URL.
 * @returns `true` if filters are included in possible set, `false` if an unknown filter is encountered.
 */
export const isFilterKeySet = (appliedFilters: string[]): appliedFilters is FilterKeys[] => {
	for (const appliedFilter of appliedFilters) {
		if (!isFilterKey(appliedFilter)) {
			return false;
		}
	}
	return true;
};

/**
 * Ensures that the row number in the URL params is valid (within the appropriate range, is a number, etc..),
 * and converts it if needed.
 * @param appliedRowNumber `number` - The row number from the URL parameter pre-converted into an Int.
 * @returns `boolean` true if valid, false if not.
 */
export const isValidRowNumber = (appliedRowNumber: number) => {
	if (
		isValidPageNumber(appliedRowNumber) &&
		(appliedRowNumber === 20 || appliedRowNumber === 50 || appliedRowNumber === 100)
	) {
		return true;
	} else {
		return false;
	}
};

/**
 * Parses number for the number of rows requested. If it's valid, it re-returns that number as a `number`
 * otherwise, it returns the default of 20.
 * @param appliedRowNumber `number` - The current row number in the URL params
 * @returns `number` - A parsed number representing the number of rows requested.
 */
export const parseRowNumber = (appliedRowNumber: number) => {
	if (isValidRowNumber(appliedRowNumber)) {
		return appliedRowNumber;
	}
	return DEFAULT_NUMBER_OF_ROWS;
};

/**
 * We do not store our id's as `PCGL-*` but as just the number value, remove the prefix as we search but ui will still display PCGL-*
 * @param searchValue search text input by the user
 * @returns string without pcgl- prefix
 * @description if text needs to be altered in anyway, add it here
 */
export const transformSearchText = (searchValue: string): string => {
	if (typeof searchValue !== 'string') {
		throw new Error('Input must be a string');
	}

	if (searchValue.toLocaleLowerCase().startsWith('pcgl-')) {
		return searchValue.slice(5);
	}

	return searchValue;
};
