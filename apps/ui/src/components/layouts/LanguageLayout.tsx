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

import { Layout } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';

import HeaderComponent from '@/components//Header';
import FooterComponent from '@/components/Footer';
import { resources } from '@/i18n/translations';

const LanguageLayout = () => {
	const { lang } = useParams();
	const { i18n } = useTranslation();
	const { pathname } = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const languages = Object.keys(resources);

		// Continue as default language
		if (!lang) {
			return;
		}

		// If the language is not identified, continue as default but remove the param
		if (!languages.includes(lang)) {
			const cleanedUrl = pathname.replace(`${lang}/`, '');

			navigate(cleanedUrl);
			return;
		}

		i18n.changeLanguage(lang);
	}, [lang, i18n, navigate, pathname]);

	return (
		<Layout style={{ minHeight: '100%' }}>
			<HeaderComponent />
			<Outlet />
			<FooterComponent />
		</Layout>
	);
};

export default LanguageLayout;
