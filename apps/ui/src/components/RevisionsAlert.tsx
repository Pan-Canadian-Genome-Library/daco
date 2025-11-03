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

import { pcglColours } from '@/providers/ThemeProvider';
import { CaretRightFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { RevisionType } from '@pcgl-daco/validation';
import { Collapse, Flex, theme, type CollapseProps } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RevisionsProps {
	sectionRevisions: RevisionType;
}

const RevisionsAlert = ({ sectionRevisions }: RevisionsProps) => {
	const { token } = theme.useToken();

	const { t: translate } = useTranslation();
	const [filterRevisions, setFilteredRevisions] = useState<CollapseProps['items'] | undefined>(undefined);

	useEffect(() => {
		const filteredRevisions: CollapseProps['items'] = sectionRevisions
			.filter((value) => !value.isApproved)
			.map((value, key) => {
				const expiresDate = translate('date.intlDateTime', {
					val: new Date(value.createdAt ?? ''),
					formatParams: {
						val: { year: 'numeric', month: '2-digit', day: '2-digit' },
					},
				});
				return {
					key,
					label: (
						<Flex gap={'middle'}>
							<ExclamationCircleFilled style={{ color: pcglColours.primary, fontSize: '1.1rem' }} />
							<>{value.isDacRequest ? `DAC Revisions - ${expiresDate}` : `Rep Revisions - ${expiresDate}`}</>
						</Flex>
					),
					children: <p>{value.comment}</p>,
					style: {
						marginBottom: 10,
						background: pcglColours.tertiary,
						borderRadius: token.borderRadiusLG,
						border: `1px solid ${pcglColours.primary}`,
					},
				};
			});
		setFilteredRevisions(filteredRevisions);
	}, [sectionRevisions, token.borderRadiusLG, token.colorFillAlter, translate]);

	return (
		<>
			{sectionRevisions.length > 0 ? (
				<Collapse
					accordion
					bordered={false}
					style={{ width: '100%' }}
					expandIcon={({ isActive }) => (
						<CaretRightFilled
							style={{ color: pcglColours.darkGrey, fontSize: '1.4rem' }}
							rotate={isActive ? 90 : -90}
						/>
					)}
					items={filterRevisions}
					expandIconPosition={'end'}
				/>
			) : null}
		</>
	);
};

export default RevisionsAlert;
