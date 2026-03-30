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

import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import List from '@/service/pdf/components/List.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
import { DATA_ACCESS_AGREEMENT } from '@/service/pdf/components/enTranslations.ts';

const DataAccessAgreement = () => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{DATA_ACCESS_AGREEMENT.TITLE}</Title>
			<Paragraph>{DATA_ACCESS_AGREEMENT.APPLICATION_COMPLETION_PARAGRAPH}</Paragraph>
			<Paragraph>{DATA_ACCESS_AGREEMENT.DACO_APPROVAL_PARAGRAPH}</Paragraph>
			<Paragraph>{DATA_ACCESS_AGREEMENT.PUBLIC_REGISTRY_PARAGRAPH}</Paragraph>
			<Paragraph>{DATA_ACCESS_AGREEMENT.AGREEMENT_ACKNOWLEDGEMENT_PARAGRAPH}</Paragraph>
			<Paragraph>{DATA_ACCESS_AGREEMENT.DEFINITIONS_PARAGRAPH}</Paragraph>
			<FormDisplay title={DATA_ACCESS_AGREEMENT.DEFINITIONS_TITLE}>
				<List items={DATA_ACCESS_AGREEMENT.DEFINITIONS_ITEMS} />
			</FormDisplay>
		</StandardPage>
	);
};

export default DataAccessAgreement;
