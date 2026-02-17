/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import type { DacDTO } from '@pcgl-daco/data-model';

import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.js';
import { dacSvc } from '@/service/dacService.ts';
import { type DacRecord, type PostgresTransaction } from '@/service/types.ts';
import { convertToDacUpdateRecord } from '@/utils/aliases.ts';
import { failure, type AsyncResult } from '@/utils/results.ts';

const logger = BaseLogger.forModule('dacController');

/**
 * Inserts & Updates Multiple DAC Group records
 * @param studies - An array of DAC DTO objects from the Submission Service
 * @returns
 */
export const createDacRecords = async ({
	dacData,
	transaction,
}: {
	dacData: DacDTO[];
	transaction?: PostgresTransaction;
}): AsyncResult<DacRecord[], 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const dacService = dacSvc(database);

		const dacGroups = dacData.map((dacRecord) => {
			const { createdAt, updatedAt } = dacRecord;
			const createdDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
			const updatedDate = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
			const record = { ...dacRecord, createdAt: createdDate, updatedAt: updatedDate };
			const updatedRecordResult = convertToDacUpdateRecord(record);
			if (updatedRecordResult.success) {
				return updatedRecordResult.data;
			}
			throw new Error(updatedRecordResult.message);
		});

		const updatedStudies = await dacService.createDacRecords({ dacGroups, transaction });

		return updatedStudies;
	} catch (error) {
		logger.error(error);
		return failure('SYSTEM_ERROR', `Unexpected error fetching updated studies`);
	}
};

/**
 * Lookup a DAC record using the records' id
 * @param dac - A DAC record from the database
 * @returns
 */
export const getDacById = async ({ id }: { id: string }): AsyncResult<DacRecord, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const dacService = dacSvc(database);

		const dacResult = await dacService.getDacById({ id });

		return dacResult;
	} catch (error) {
		const message = `Failed to retrieve DAC record with id: ${id}`;
		logger.error(message, error);
		return failure('SYSTEM_ERROR', message);
	}
};
