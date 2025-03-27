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

import { Image, StyleSheet, View } from '@react-pdf/renderer';

import DataItem from '@/service/pdf/components/DataItem.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import { standardStyles } from '@/service/pdf/components/standardStyling.ts';

interface SignatureProps {
	src?: string | null;
	date?: Date | null;
}

const style = StyleSheet.create({
	signatureView: {
		marginTop: standardStyles.textStyles.sizes.lg,
	},
	image: {
		marginBottom: standardStyles.textStyles.sizes.sm,
		backgroundColor: standardStyles.colours.tertiary,
		padding: `${standardStyles.textStyles.sizes.sm} 0 0 0`,
		maxWidth: '50%',
		borderBottom: 1,
		borderBottomColor: standardStyles.colours.primary,
	},
});

const Signature = ({ src, date }: SignatureProps) => {
	return (
		<View>
			{!src ? (
				<Paragraph notice>&mdash;&nbsp;Signature Missing&nbsp;&mdash;</Paragraph>
			) : (
				<View style={style.signatureView}>
					<Image
						style={style.image}
						src={{
							uri: src,
						}}
					/>
					<DataItem item="Date">{date?.toLocaleString('en-CA', { dateStyle: 'long', timeStyle: 'long' })}</DataItem>
				</View>
			)}
		</View>
	);
};

export default Signature;
