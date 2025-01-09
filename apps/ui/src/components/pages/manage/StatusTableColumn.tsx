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

import { ExclamationCircleFilled } from '@ant-design/icons';
import { ApplicationStates, ApplicationStateValues } from '@pcgl-daco/data-model/src/types';
import { Flex, theme } from 'antd';
import { useTranslation } from 'react-i18next';

const { useToken } = theme;

interface StatusBarColumnType {
	value: ApplicationStateValues;
}

const StatusTableColumn = ({ value }: StatusBarColumnType) => {
	const { token } = useToken();
	const { t: translate } = useTranslation();
	return (
		<Flex gap={token.padding} justify="space-between">
			{translate(`application.states.${value}`)}
			{value === ApplicationStates.DAC_REVIEW ? (
				<ExclamationCircleFilled style={{ color: token.colorPrimary }} />
			) : null}
		</Flex>
	);
};

export default StatusTableColumn;
