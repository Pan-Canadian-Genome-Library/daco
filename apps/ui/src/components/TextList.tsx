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
import { List, theme } from 'antd';

const { useToken } = theme;

type TextProps = {
	data: (string | JSX.Element)[];
	isNumbered?: boolean;
};

/**
 *  @description Component to display a list of string data
 *  purpose: Antd has a List component but does not allow usage of standard css list-style like disc or numbers.
 */
const TextList = ({ data, isNumbered = false }: TextProps) => {
	const { token } = useToken();

	const listStyles: React.CSSProperties = {
		margin: 0,
		listStyleType: isNumbered ? 'number' : 'disc',
	};
	const listItemStyles: React.CSSProperties = {
		fontSize: token.fontSizeLG,
		margin: `${token.marginXS}px 0px`,
		lineHeight: token.lineHeight,
	};

	return (
		<ul style={listStyles}>
			{data.map((item, index) => {
				return (
					<List.Item key={index} style={listItemStyles}>
						{item}
					</List.Item>
				);
			})}
		</ul>
	);
};

export default TextList;
