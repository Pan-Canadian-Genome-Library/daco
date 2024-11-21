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

import { theme } from 'antd';
import { useEffect, useState } from 'react';

import { ApplicationStatus } from '@/components/mock/applicationMockData';
import { pcglColors } from '@/components/providers/ThemeProvider';

const { useToken } = theme;

/**
 * TODO: custom hook is using mockdata, subject to change once API is designed
 *
 * @description Custom hook manage state of the application cards
 *
 * @param applicationStatus
 * @returns showEdit - show edit button logic
 * @returns showActionRequired - show action required text
 * @returns color - the color to apply to to the application status
 *
 */

const useApplicationStatusHook = (applicationStatus: ApplicationStatus) => {
	const { token } = useToken();
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [showActionRequired, setShowActionRequred] = useState<boolean>(false);
	const [color, setColor] = useState<string>(token.colorWhite);

	useEffect(() => {
		switch (applicationStatus) {
			case ApplicationStatus.Draft:
				setShowEdit(true);
				setColor(token.colorWarning);
				setShowActionRequred(false);
				break;
			case ApplicationStatus.RepReview:
				setShowEdit(true);
				setColor(token.colorWarning);
				setShowActionRequred(false);
				break;
			case ApplicationStatus.DACReview:
				setShowEdit(true);
				setColor(token.colorWarning);
				setShowActionRequred(false);
				break;
			case ApplicationStatus.RepRevision:
				setShowEdit(true);
				setColor(token.colorWarning);
				setShowActionRequred(true);
				break;
			case ApplicationStatus.DACRevision:
				setShowEdit(true);
				setColor(token.colorWarning);
				setShowActionRequred(true);
				break;
			case ApplicationStatus.Rejected:
				setShowEdit(false);
				setColor(pcglColors.errorSecondary);
				setShowActionRequred(false);
				break;
			case ApplicationStatus.Revoked:
				setShowEdit(false);
				setColor(pcglColors.errorSecondary);
				setShowActionRequred(false);
				break;
			case ApplicationStatus.Approved:
				setShowEdit(false);
				setColor(pcglColors.successSecondary);
				setShowActionRequred(false);
				break;
			case ApplicationStatus.Closed:
				setShowEdit(false);
				setColor(pcglColors.grey);
				setShowActionRequred(false);
				break;
			default:
				break;
		}
	}, [applicationStatus]);

	return { showEdit, showActionRequired, color };
};

export default useApplicationStatusHook;
