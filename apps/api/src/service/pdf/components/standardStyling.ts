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

const colours = {
	primary: '#C41D7F',
	secondary: '#520339',
	tertiary: '#FFF0F6',
	grey: '#D9D9D9',
	lightGrey: '#FAFAFA',
};

const textStyles = {
	fonts: {
		openSansLight: './src/service/pdf/components/fonts/OpenSans-Light.ttf',
		openSansRegular: './src/service/pdf/components/fonts/OpenSans-Regular.ttf',
		openSansBold: './src/service/pdf/components/fonts/OpenSans-Bold.ttf',
		leagueSpartanLight: './src/service/pdf/components/fonts/LeagueSpartan-Light.ttf',
		leagueSpartanRegular: './src/service/pdf/components/fonts/LeagueSpartan-Regular.ttf',
		leagueSpartanBold: './src/service/pdf/components/fonts/LeagueSpartan-Bold.ttf',
	},
	sizes: {
		sm: '8.75pt',
		md: '10.5pt',
		lg: '15.12pt',
		xl: '18.14pt',
		xxl: '21.77pt',
	},
};

const standardStyles = {
	textStyles,
	colours,
};

export { standardStyles };
