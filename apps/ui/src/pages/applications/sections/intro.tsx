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

import { Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import ApplicationWrapper from '@/components/layouts/SectionWrapper';
import SectionFooter from '@/components/pages/application/SectionFooter';
import TextList from '@/components/TextList';

const { Title, Text } = Typography;

const Introduction = () => {
	const { t: translate } = useTranslation();

	const qualifyData = [
		translate('intro-section.qualifyPoint1'),
		translate('intro-section.qualifyPoint2'),
		translate('intro-section.qualifyPoint3'),
		translate('intro-section.qualifyPoint4'),
		translate('intro-section.qualifyPoint5'),
	];

	const accessData = [
		translate('intro-section.accessPoint1'),
		translate('intro-section.accessPoint2'),
		translate('intro-section.accessPoint3'),
	];

	return (
		<ApplicationWrapper>
			<>
				<Flex vertical>
					<Title level={2}>{translate('intro-section.title')}</Title>
					<Text>{translate('intro-section.qualifyAccess')}</Text>
					<TextList data={qualifyData} />
				</Flex>
				<Flex vertical>
					<Text>{translate('intro-section.receiveAccess')}</Text>
					<TextList data={accessData} isNumbered />
				</Flex>
				<Flex vertical>
					<Text>{translate('intro-section.description1')}</Text>
				</Flex>
				<Flex vertical>
					<Text>{translate('intro-section.description2')}</Text>
				</Flex>
				<SectionFooter />
			</>
		</ApplicationWrapper>
	);
};

export default Introduction;
