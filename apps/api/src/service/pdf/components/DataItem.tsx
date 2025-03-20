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

import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ReactNode } from 'react';
import { standardStyles } from './standardStyling.ts';

interface DataItemProps {
	item: string;
	children: ReactNode | string;
	layout?: 'stacked' | 'horizontal';
	isLink?: boolean;
	linkPrefix?: string;
}

const styles = StyleSheet.create({
	dataItem: {
		display: 'flex',
		fontSize: standardStyles.textStyles.sizes.md,
	},
	linkItem: {
		color: standardStyles.colours.primary,
	},
	itemText: {
		fontWeight: 'bold',
	},
	horizontalLayout: {
		flexDirection: 'row',
		gap: '5pt',
	},
	stackedLayout: {
		flexDirection: 'column',
	},
});

const DataItem = ({ item, children, layout = 'horizontal', isLink = false, linkPrefix }: DataItemProps) => {
	const calcLayout = () =>
		layout === 'horizontal'
			? { ...styles.dataItem, ...styles.horizontalLayout }
			: { ...styles.dataItem, ...styles.stackedLayout };
	return (
		<View style={calcLayout()}>
			<Text style={styles.itemText}>{item}:</Text>
			<Text>
				{isLink && children ? (
					<Link style={styles.linkItem} src={`${linkPrefix ?? ''}${String(children)}`}>
						{children}
					</Link>
				) : (
					(children ?? '—')
				)}
			</Text>
		</View>
	);
};

export default DataItem;
