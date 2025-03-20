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

import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
import { CollaboratorDTO } from '@pcgl-daco/data-model';
import { View } from '@react-pdf/renderer';
import CollaboratorsTable from '../CollaboratorsTable.tsx';

const Collaborators = ({ collaborators }: { collaborators: CollaboratorDTO[] }) => {
	return (
		<StandardPage fixed useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>Collaborators</Title>
			<Paragraph>
				Please include the names of all investigators, collaborators, research staff (including post-docs) and students
				(including graduate students), who will have access to the PCGL Controlled Data in order to work on the Research
				Summary as outlined in Section D of this application.
			</Paragraph>
			<Paragraph>Collaborators are not required for your applications to be approved.</Paragraph>
			<Paragraph>
				* Please note: co-investigators, collaborators or students at other institutions should not be included in this
				list. They will have to submit a separate application for access to controlled data.
			</Paragraph>
			<View style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
				<CollaboratorsTable data={collaborators} />
			</View>
		</StandardPage>
	);
};

export default Collaborators;
