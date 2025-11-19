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

import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import useGetSignatures from '@/api/queries/useGetSignatures';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import SubmitApplicationModal from '@/components/pages/application/modals/SubmitApplicationModal';
import ApplicantSignatureView from '@/components/pages/application/signature-views/ApplicantSignatureView';
import DacSignatureView from '@/components/pages/application/signature-views/DacSignatureView';
import RepSignatureView from '@/components/pages/application/signature-views/RepSignatureView';
import { ValidateAllSections } from '@/components/pages/application/utils/validatorFunctions';
import ProtectedComponent from '@/components/ProtectedComponent';
import { ApplicationOutletContext } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { ApplicationStates } from '@pcgl-daco/data-model';

const SignAndSubmit = () => {
	const [openModal, setOpenModal] = useState(false);
	const {
		state: { fields, applicationState },
	} = useApplicationContext();
	const { isEditMode, appId } = useOutletContext<ApplicationOutletContext>();
	const navigation = useNavigate();
	const { data, isLoading } = useGetSignatures({ applicationId: appId });

	// Push user back to intro if they did not complete/fix all the sections
	useEffect(() => {
		if (!ValidateAllSections(fields) && applicationState === ApplicationStates.DRAFT) {
			navigation(`/application/${appId}/intro${isEditMode ? '/edit' : ''}`, { replace: true });
		}
	}, [appId, fields, isEditMode, navigation, applicationState]);

	return (
		<>
			<SectionWrapper>
				<Form layout="vertical" onFinish={() => setOpenModal(true)}>
					<ProtectedComponent requiredRoles={['APPLICANT']}>
						<ApplicantSignatureView signatureData={data} signatureLoading={isLoading} setOpenModal={setOpenModal} />
					</ProtectedComponent>
					<ProtectedComponent requiredRoles={['INSTITUTIONAL_REP']}>
						<RepSignatureView signatureData={data} signatureLoading={isLoading} setOpenModal={setOpenModal} />
					</ProtectedComponent>
					<ProtectedComponent requiredRoles={['DAC_CHAIR', 'DAC_MEMBER']}>
						<DacSignatureView signatureData={data} signatureLoading={isLoading} setOpenModal={setOpenModal} />
					</ProtectedComponent>
				</Form>
			</SectionWrapper>
			<SubmitApplicationModal isOpen={openModal} setIsOpen={setOpenModal} />
		</>
	);
};

export default SignAndSubmit;
