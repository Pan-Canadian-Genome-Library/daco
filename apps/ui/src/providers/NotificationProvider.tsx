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

/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { notification } from 'antd';
import { createContext, PropsWithChildren, ReactNode, useContext } from 'react';

type NotificationType = 'success' | 'info' | 'warning' | 'error';
type PlacementType = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

type openNotificationParamsType = {
	type: NotificationType;
	message: string | ReactNode;
	description?: string | ReactNode;
	placement?: PlacementType;
};

type NotificationState = {
	openNotification: (params: openNotificationParamsType) => void;
};

const NotificationContext = createContext<NotificationState>({
	openNotification: function (_: openNotificationParamsType): void {
		throw new Error('openNotification has not been initialized.');
	},
});

export function NotificationProvider({ children }: PropsWithChildren) {
	const [api, contextHolder] = notification.useNotification();

	const openNotification = ({ type, message, description, placement = 'top' }: openNotificationParamsType) => {
		api[type]({
			message,
			description,
			placement,
		});
	};

	return (
		<NotificationContext.Provider value={{ openNotification }}>
			<>
				{contextHolder}
				{children}
			</>
		</NotificationContext.Provider>
	);
}

export function useNotificationContext() {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error('useNotificationContext must be used within a NotificationProvider');
	}
	return context;
}
