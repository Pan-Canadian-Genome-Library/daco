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

import { Divider, Flex, Typography } from 'antd';
import { PropsWithChildren } from 'react';

const { Title, Text } = Typography;

interface SectionTitleProps extends PropsWithChildren {
	title: string;
	text?: string[];
	textAbidesNewLines?: boolean;
	showDivider?: boolean;
}

const SectionTitle = ({
	title,
	text = [],
	showDivider = true,
	textAbidesNewLines = false,
	children,
}: SectionTitleProps) => {
	return (
		<Flex vertical>
			<Title level={2}>{title}</Title>
			<Flex vertical gap={'middle'}>
				{text.map((text, index) => {
					return (
						<Text style={textAbidesNewLines ? { whiteSpace: 'pre-line' } : undefined} key={index}>
							{text}
						</Text>
					);
				})}
			</Flex>
			{children}
			{showDivider && <Divider />}
		</Flex>
	);
};

export default SectionTitle;
