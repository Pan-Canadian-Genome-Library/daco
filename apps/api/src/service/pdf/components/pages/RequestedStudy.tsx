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

import { Link } from '@react-pdf/renderer';

import { RequestedStudiesDTO } from '@pcgl-daco/data-model';

import DataItem from '@/service/pdf/components/DataItem.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import { standardStyles } from '@/service/pdf/components/standardStyling.ts';
import Title from '@/service/pdf/components/Title.tsx';

const RequestedStudy = ({ requestedStudies }: RequestedStudiesDTO) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>Requested Study</Title>
			<Paragraph>
				To help the DAC review your data access request more efficiently, please select the study you are requesting
				access to. You can view and choose from the available studies on the&nbsp;
				{/**TODO: Add Link to this once that's figured out. */}
				<Link style={{ color: standardStyles.colours.primary }}>PCGL Research Portal - Studies.</Link>
			</Paragraph>
			<DataItem item={requestedStudies?.length && requestedStudies.length > 1 ? 'Study Names' : 'Study Name'}>
				{requestedStudies?.map((study, index) => `${study}${requestedStudies.length !== index + 1 ? ', ' : ''}`)}
			</DataItem>
		</StandardPage>
	);
};

export default RequestedStudy;
