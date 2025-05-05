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

import { Path, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';
import { ReactNode } from 'react';

import { standardStyles } from '@/service/pdf/components/standardStyling.ts';

interface CheckboxProps {
	children: string | ReactNode;
	unchecked?: boolean;
}

const styles = StyleSheet.create({
	checkboxContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: standardStyles.textStyles.sizes.md,
	},
	checkboxImageContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: standardStyles.textStyles.sizes.lg,
		width: standardStyles.textStyles.sizes.lg,
		borderRadius: '2.5px',
		padding: '1.25px',
	},
	checkboxPath: {
		fill: '#fff',
	},
	checkboxText: {
		// This is to fix a bug where text does not respect padding or margin boundaries.
		flex: 1,
		fontSize: standardStyles.textStyles.sizes.md,
	},
});

const Checkbox = ({ children, unchecked }: CheckboxProps) => {
	return (
		<View style={styles.checkboxContainer} wrap={false}>
			<View
				style={{
					...styles.checkboxImageContainer,
					backgroundColor: unchecked ? '#fff' : standardStyles.colours.primary,
					border: unchecked ? `1.25px solid ${standardStyles.colours.grey}` : '0',
				}}
			>
				{!unchecked ? (
					<Svg width="16" height="16" viewBox="0 0 16 16">
						<Path
							style={styles.checkboxPath}
							d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"
						/>
					</Svg>
				) : null}
			</View>
			{typeof children === 'string' ? <Text style={styles.checkboxText}>{children}</Text> : children}
		</View>
	);
};

export default Checkbox;
