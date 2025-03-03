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

import { uploadEthicsFile } from '@/controllers/fileController.js';
import { Router } from 'express';
import formidable from 'formidable';
const fileRouter = Router();

const validFileTypes = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * TODO: NO current Auth rules implemented
 *  -
 */
fileRouter.post('/upload-ethics/:applicationId', async (req, res) => {
	const { applicationId } = req.params;

	const form = formidable({
		keepExtensions: true,
		maxFileSize: 5 * 1024 * 1024, // 5MB limit
		maxFiles: 1,
		allowEmptyFiles: false,
	});

	form.parse(req, async (err, _, files) => {
		if (err) {
			res.status(400).send({ message: 'Invalid file upload' });
			return;
		}

		if (!files.file || !files.file[0]) {
			res.status(400).send({ message: 'File does not exist' });
			return;
		}

		const file = files.file[0];

		if (!file.mimetype) {
			res.status(400).send({ message: 'File type was not specified' });
			return false;
		}

		if (!validFileTypes.includes(`${file.mimetype}`)) {
			res.status(400).send({ message: 'Invalid file type' });
			return false;
		}

		const result = await uploadEthicsFile({ applicationId: parseInt(applicationId), file });

		if (result.success) {
			res.status(200).send(result.data);
			return;
		} else {
			const errorReturn = { message: result.message, errors: String(result.errors) };
			res.status(500).send(errorReturn);
			return;
		}
	});
});
export default fileRouter;
