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

fileRouter.post('/upload-ethics/:applicationId', async (req, res, next) => {
	const { applicationId } = req.params;
	const form = formidable({
		keepExtensions: true,
		maxFileSize: 5 * 1024 * 1024, // 5MB limit
	});

	form.parse(req, async (err, fields, files) => {
		if (err) {
			next(err);
			return;
		}
		if (!files.file) {
			console.log('file does not exist');
			return;
		}
		const file = files.file[0];

		if (!file) {
			return;
		}

		await uploadEthicsFile({ applicationId: parseInt(applicationId), file });
		res.json({ fields, files });
	});
});
export default fileRouter;
