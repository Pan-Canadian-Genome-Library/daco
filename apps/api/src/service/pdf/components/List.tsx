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

import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { standardStyles } from '@/service/pdf/components/standardStyling.ts';

const styles = StyleSheet.create({
	list: {
		fontFamily: 'OpenSans',
		fontWeight: 'normal',
		lineHeight: '1rem',
		fontSize: standardStyles.textStyles.sizes.md,
		display: 'flex',
		flexDirection: 'column',
		gap: '.3rem',
		padding: '0 0 0 0.7cm',
	},
	listItem: {
		display: 'flex',
		flexDirection: 'row',
		gap: '.5rem',
	},
	listText: {
		// This is to fix a bug where text does not respect padding or margin boundaries.
		flex: 1,
	},
});
const List = ({ items, isNumbered }: { items: string[]; isNumbered?: boolean }) => {
	return (
		<View style={styles.list}>
			{items.map((li, index) => (
				<View style={styles.listItem} key={li} wrap={false}>
					{isNumbered ? <Text>{`${index + 1}.`}</Text> : <Text>&#x2022;</Text>}
					<Text style={styles.listText}>{`${li}`}</Text>
				</View>
			))}
		</View>
	);
};

export default List;
