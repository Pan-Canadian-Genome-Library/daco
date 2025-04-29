/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import useCreateApplication from '@/api/mutations/useCreateApplication';
import { Card, Flex, theme, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { useToken } = theme;

const NewApplicationCard = () => {
	const { t: translate } = useTranslation();
	const { token } = useToken();

	const { mutate: createNewApplication } = useCreateApplication();

	const handleCardClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
		if (('key' in event && (event.key === 'Enter' || event.key === ' ')) || event.type === 'click') {
			event.stopPropagation();
			createNewApplication();
		}
	};

	return (
		<Card
			style={{ backgroundColor: token.colorWhite, minHeight: 200, height: 200, cursor: 'pointer' }}
			hoverable
			tabIndex={0}
			onClick={handleCardClick}
			onKeyDown={handleCardClick}
		>
			<Flex justify="center" align="center" vertical gap="middle" style={{ height: '100%' }}>
				<Title level={3}>{translate('dashboard.startNewApp')}</Title>
			</Flex>
		</Card>
	);
};

export default NewApplicationCard;
