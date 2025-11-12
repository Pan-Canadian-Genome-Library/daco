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
import { CaretRightFilled } from '@ant-design/icons';
import { Collapse } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CommentLabel from './CommentLabel';

type SectionComments = {
	id: number;
	application_id: number;
	comments: string;
	username: string;
	dac_chair_only: boolean;
	section: string;
	created_at: Date | string;
};

interface DacCommentsProps {
	sectionComments: SectionComments[];
}

const DacComments = ({ sectionComments }: DacCommentsProps) => {
	const { t: translate } = useTranslation();

	const [comments, setComments] = useState<{
		dacComments: SectionComments[];
		chairOnly: SectionComments[];
	}>({
		dacComments: [],
		chairOnly: [],
	});

	useEffect(() => {
		setComments({
			dacComments: sectionComments.filter((comment) => !comment.dac_chair_only),
			chairOnly: sectionComments.filter((comment) => comment.dac_chair_only),
		});
	}, [sectionComments]);

	/**
	 * The Dac Comments and For Chair Only dropdown collapse UI.
	 */
	const DACOptions = [
		{
			key: '1',
			label: <CommentLabel label="DAC Comments" numOfComments={comments.dacComments.length} />,
			children: (
				<div>
					{comments.dacComments.map((comment) => (
						<div key={comment.id}>
							<p>{comment.comments}</p>
							<p>{comment.username}</p>
						</div>
					))}
				</div>
			),
			style: itemStyles,
		},
		{
			key: '2',
			label: <CommentLabel label="For Chair Only" numOfComments={comments.chairOnly.length} />,
			children: (
				<div style={{ overflow: 'auto' }}>
					{comments.chairOnly.map((comment) => (
						<div key={comment.id} style={{ zIndex: 1 }}>
							<p>{comment.comments}</p>
							<p>{comment.username}</p>
						</div>
					))}
				</div>
			),
			style: itemStyles,
		},
	];

	return (
		<>
			<Collapse
				accordion
				bordered={false}
				style={{ width: '100%' }}
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
