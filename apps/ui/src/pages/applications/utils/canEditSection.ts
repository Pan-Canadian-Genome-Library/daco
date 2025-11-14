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

import { SectionRevision, SectionRoutesValues } from '@pcgl-daco/validation';
/**
 *
 * Checks if a user is able to edit a section in the Application Viewer.
 * This can be provisioned via one of two ways:
 *
 * 1. If we're currently in `DAC_REVISIONS_REQUESTED` or `INSTITUTIONAL_REP_REVISIONS_REQUESTED`,
 *    if this is the case, then we want to verify if the current section is not yet approved by
 *    the DAC or Rep. If `isApproved` is `false`, then we're allowed to edit that section to make
 *    amendments.
 *
 *    If we're not in `DAC_REVISIONS_REQUESTED` or `INSTITUTIONAL_REP_REVISIONS_REQUESTED`
 *    then the `isApproved` is always set to `undefined` in the API hook.
 *    This is because we cannot edit outside of these modes (besides edit mode, more on that below),
 *    and so we want to ensure that we always fail, even if there are technically "revisions"
 *    from the previous cycle of revisions requests.
 *
 * 2. If we're currently in `/edit` mode, then we can always edit. `/edit` is only enabled when we're
 *    in DRAFT mode.
 *
 * @param revisions - The revisions object fetched via the API.
 * @param section - The current page / section.
 * @param isEditMode - Boolean representing of we're in edit mode (`/edit`)
 * @returns `Boolean`, `true` if you can edit the section, `false` if you cannot.
 */
const canEditSection = ({
	revisions,
	section,
	isEditMode,
}: {
	revisions: SectionRevision;
	section: SectionRoutesValues;
	isEditMode: boolean;
}) => {
	const currentRevision = revisions[section];

	if (!currentRevision) {
		return false;
	} else if ((currentRevision[0]?.isApproved !== undefined && !currentRevision[0]?.isApproved) || isEditMode) {
		return true;
	}
	return false;
};

export { canEditSection };
