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

import { deleteFile, getFile, uploadEthicsFile } from '@/controllers/fileController.ts';
import { apiZodErrorMapping } from '@/utils/validation.ts';
import { fileUploadValidation, withParamsSchemaValidation } from '@pcgl-daco/request-utils';
import { fileDeleteParamsSchema, getFileByIdParamsSchema, isPositiveInteger } from '@pcgl-daco/validation';
import express, { type Request, type Response } from 'express';
import formidable from 'formidable';

const fileRouter = express.Router();

fileRouter.get(
	'/:fileId',
	withParamsSchemaValidation(getFileByIdParamsSchema, apiZodErrorMapping, async (req, res) => {
		const { fileId } = req.params;

		const id = parseInt(fileId ? fileId : '');

		if (!isPositiveInteger(id)) {
			res.status(400).send({ message: 'Invalid fileId' });
			return;
		}
		const result = await getFile({ fileId: id });

		if (!result.success) {
			res.status(500).send(result);
			return;
		}

		res.status(200).send(result.data);
		return;
	}),
);

fileRouter.post(
	'/ethics/:applicationId',
	fileUploadValidation(async (req: Request<any, { file: formidable.File }>, res: Response) => {
		const { applicationId } = req.params;

		const { file } = req.body;

		const id = parseInt(applicationId ? applicationId : '');

		if (!isPositiveInteger(id)) {
			res.status(400).json({ message: 'Invalid applicationId' });
			return;
		}

		const result = await uploadEthicsFile({ applicationId: id, file });
		if (result.success) {
			res.status(200).send({
				id: result.data.id,
				filename: result.data.filename,
			});
			return;
		} else {
			res.status(500).json({ message: result.message, error: 'SYSTEM_ERROR' });
			return;
		}
	}),
);

fileRouter.delete(
	'/:fileId',
	withParamsSchemaValidation(fileDeleteParamsSchema, apiZodErrorMapping, async (req: Request, res: Response) => {
		const { fileId } = req.params;
		const id = parseInt(fileId ? fileId : '');

		if (!isPositiveInteger(id)) {
			res.status(400).json({ message: 'Invalid fileId' });
			return;
		}

		const result = await deleteFile({ fileId: id });

		if (!result.success) {
			res.status(500).json(result);
			return;
		}

		res.status(204).send();
		return;
	}),
);

fileRouter.get(
	'/:fileId/download',
	withParamsSchemaValidation(fileDeleteParamsSchema, apiZodErrorMapping, async (req: Request, res: Response) => {
		const { fileId } = req.params;
		const id = parseInt(fileId ? fileId : '');

		if (!isPositiveInteger(id)) {
			res.status(400).send({ message: 'Invalid fileId' });
			return;
		}

		const result = await getFile({ fileId: id, withBuffer: true });

		if (!result.success) {
			res.status(500).send(result);
			return;
		}

		res.status(200).send(result.data);
		return;
	}),
);

export default fileRouter;
