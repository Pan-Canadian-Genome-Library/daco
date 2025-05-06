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

import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Layout, Spin, Typography } from 'antd';

const { Content } = Layout;
const { Text } = Typography;

interface FullscreenLoaderProps {
	trueFullscreen?: boolean;
	loadingText?: string;
}

const FullscreenLoader = ({ trueFullscreen = false, loadingText }: FullscreenLoaderProps) => {
	if (trueFullscreen && loadingText) {
		console.error(
			'Error: FullscreenLoader - Using trueFullscreen with loadingText provided will result in text appearing behind the loader. ',
		);
	}

	return (
		<Content style={{ display: 'flex' }}>
			<Flex align="center" justify="center" vertical gap={'2rem'} flex={1}>
				<Spin fullscreen={trueFullscreen} indicator={<LoadingOutlined style={{ fontSize: 56 }} spin />} />
				{loadingText ? <Text>{loadingText}</Text> : null}
			</Flex>
		</Content>
	);
};

export default FullscreenLoader;
