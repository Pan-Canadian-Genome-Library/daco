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

import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { pcglColours } from '@/providers/ThemeProvider';
import { CaretRightFilled } from '@ant-design/icons';
import { DacCommentRecord } from '@pcgl-daco/data-model';
import { Button, Collapse, Flex, Input, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import CommentEntry from './CommentEntry';
import CommentLabel from './CommentLabel';

interface DacCommentsProps {
	sectionComments: DacCommentRecord[];
}

const DacComments = ({ sectionComments }: DacCommentsProps) => {
	const {
		state: { applicationUserRole },
	} = useApplicationContext();
	const { t: translate } = useTranslation();

	const shouldEnableCreateComment = applicationUserRole === 'DAC_CHAIR' || applicationUserRole === 'DAC_MEMBER';

	const dacComments = sectionComments.filter((comment) => !comment.dacChairOnly);
	const chairOnlyComments = sectionComments.filter((comment) => comment.dacChairOnly);

	/**
	 * The Dac Comments and For Chair Only dropdown collapse UI.
	 */
	const DACOptions = [
		{
			key: '1',
			label: <CommentLabel label={translate('generic.dacComment')} numOfComments={dacComments.length} />,
			children: (
				<>
					<Flex vertical style={{ overflow: 'auto', maxHeight: '200px' }}>
						{dacComments.map((comment) => (
							<CommentEntry
								key={comment.id}
								id={comment.id}
								username={comment.userName}
								comments={comment.message}
								submittedAt={new Date()}
							/>
						))}
					</Flex>
					{shouldEnableCreateComment ? (
						<Space.Compact style={{ marginTop: '10px', width: '100%' }}>
							<Input />
							<Button style={{ background: pcglColours.blue }} type="primary">
								{translate('generic.send')}
							</Button>
						</Space.Compact>
					) : null}
				</>
			),
			style: itemStyles,
		},
		...(shouldEnableCreateComment && chairOnlyComments.length > 0
			? [
					{
						key: '2',
						label: <CommentLabel label={translate('generic.chairOnly')} numOfComments={chairOnlyComments.length} />,
						children: (
							<>
								<Flex vertical style={{ overflow: 'auto', maxHeight: '200px' }}>
									{chairOnlyComments.map((comment) => (
										<CommentEntry
											key={comment.id}
											id={comment.id}
											username={comment.userName}
											comments={comment.message}
											submittedAt={new Date()}
										/>
									))}
								</Flex>
								<Space.Compact style={{ marginTop: '10px', width: '100%' }}>
									<Input />
									<Button style={{ background: pcglColours.blue }} type="primary">
										{translate('generic.send')}
									</Button>
								</Space.Compact>
							</>
						),
						style: itemStyles,
					},
				]
			: []),
	];

	return (
		<>
			<Collapse
				accordion
				bordered={false}
				style={{
					width: '100%',
				}}
				expandIcon={({ isActive }) => (
					<CaretRightFilled style={{ color: pcglColours.darkGrey, fontSize: '1.4rem' }} rotate={isActive ? 90 : -90} />
				)}
				items={DACOptions}
				expandIconPosition={'end'}
			/>
		</>
	);
};

export default DacComments;

const itemStyles = {
	marginBottom: 10,
	background: pcglColours.geekBlue,
	borderRadius: 8,
	border: `1px solid ${pcglColours.blue}`,
	maxHeight: '375px',
};
