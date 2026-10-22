/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import { useTranslation } from 'react-i18next';

import { pcglColours } from '@/providers/ThemeProvider';
import { FooterContainer } from '@repo/ui/footer';

const temp_footer_items = [
	{
		title: 'about',
		items: [
			{ label: 'pcglWebsite', href: 'pcglWebsite' },
			{ label: 'publicationPolicy', href: 'publicationPolicy' },
			{ label: 'helpGuides', href: 'helpGuides' },
		],
	},
	{
		title: 'connect',
		items: [
			{ label: 'contact', href: 'contact' },
			{ label: 'subscribe', href: 'subscribe' },
			{ label: 'linkedin', href: 'linkedin' },
		],
	},
];

const PortalBand = () => {
	const { t } = useTranslation();
	return <span>{t('global.copyright', { date: new Date().getFullYear() })}</span>;
};

export const FooterComponent = () => {
	const brandColor = pcglColours.secondary;
	const { t } = useTranslation();
	return (
		<FooterContainer brand={brandColor} translator={t} PortalBand={<PortalBand />} footerItems={temp_footer_items} />
	);
};

export default FooterComponent;
