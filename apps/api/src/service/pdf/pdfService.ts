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

import { PDFDocument } from 'pdf-lib';

import { ApplicationResponseData, CollaboratorDTO, FilesDTO, SignatureDTO } from '@pcgl-daco/data-model';

import { serverConfig } from '@/config/serverConfig.ts';
import logger from '@/logger.ts';
import { renderApplicationPDF } from '@/service/pdf/documents/PCGLApplication.tsx';
import { failure, success } from '@/utils/results.ts';

/**
 * These constants appear in the PDF metadata, either in Finder / Windows Explorer file metadata, or within
 * "document properties" in most PDF readers.
 *
 * PDF Creator - This is the "app" used to create the PDF, in our case it's the DACO backend, so putting the app ve
 * makes sense.
 *
 * PDF Author - This is the author of the PDF. In our case it's the Data Compliance Office at PCGL. This may however,
 * benefit from i18n when we add French post MVP.
 *
 * See below for all properties of a PDF doc:
 * @see https://pdf-lib.js.org/docs/api/classes/pdfdocument#setauthor
 */
const PDF_CREATOR_PRODUCER = `Pan-Canadian Genome Library DACO (ver. ${serverConfig.npm_package_version})`;
const PDF_AUTHOR = `Data Access Compliance Office, Pan-Canadian Genome Library`;

/**
 * Sets the PDF language in the metadata, EN-CA - English Canada
 *
 * This metadata feature can be useful for a11y reasons:
 * @see https://www.w3.org/TR/WCAG20-TECHS/PDF16.html
 *
 * TODO: -
 * 	When we eventually do translation we should make this a toggle to set this to
 * 	FR-CA - French Canada. However, if we make the PDF have both languages
 * 	(English followed by French for example), we should set this based on the pages
 * 	instead of the entire document.
 */
const PDF_LANGUAGE = `en-ca`;

const pdfService = () => ({
	renderPCGLApplicationPDF: async ({
		applicationContents,
		signatureContents,
		collaboratorsContents,
		fileContents,
		filename,
	}: {
		applicationContents: ApplicationResponseData;
		signatureContents: SignatureDTO;
		collaboratorsContents: CollaboratorDTO[];
		fileContents: FilesDTO;
		filename: string;
	}) => {
		/**
		 * This acts as a title for the PDF, displayed at the top. Along with being displayed as
		 * metadata. See comments and links above.
		 */
		const PDF_SUBJECT = `Application for Access to PCGL Controlled Data`;

		try {
			const pdfCreationDate = new Date();

			const applicationPDF = await renderApplicationPDF({
				applicationContents: applicationContents,
				signature: signatureContents,
				collaborators: collaboratorsContents,
				docCreatedAt: pdfCreationDate,
			});

			const finalApplication = await PDFDocument.create();

			finalApplication.setLanguage(PDF_LANGUAGE);
			finalApplication.setTitle(filename, {
				showInWindowTitleBar: true,
			});
			finalApplication.setSubject(PDF_SUBJECT);
			finalApplication.setAuthor(PDF_AUTHOR);
			finalApplication.setCreator(PDF_CREATOR_PRODUCER);
			finalApplication.setProducer(PDF_CREATOR_PRODUCER);
			finalApplication.setCreationDate(pdfCreationDate);
			finalApplication.setModificationDate(pdfCreationDate);

			const baseApplication = await PDFDocument.load(applicationPDF);
			const ethicsPDF = await PDFDocument.load(fileContents.content);

			const originalPDFPages = await finalApplication.copyPages(baseApplication, baseApplication.getPageIndices());
			originalPDFPages.forEach((page) => finalApplication.addPage(page));

			const ethicsPages = await finalApplication.copyPages(ethicsPDF, ethicsPDF.getPageIndices());
			ethicsPages.forEach((page) => finalApplication.addPage(page));

			return success(await finalApplication.save());
		} catch (err) {
			const message = `Error Rendering Application to PDF file.`;

			logger.error(message);
			logger.error(err);

			return failure('SYSTEM_ERROR', message);
		}
	},
});

export { pdfService };
