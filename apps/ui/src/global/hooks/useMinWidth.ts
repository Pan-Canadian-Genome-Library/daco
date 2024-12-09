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

import { useEffect, useState } from 'react';

/**
 * Breakpoints for common device sizes, based off of breakpoints provided by Bootstrap 4.0, which are used by Ant Design components.
 * @see(@link https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints)
 * @see(@link https://ant.design/components/grid#design-token)
 */
export const Breakpoints = {
	XL: 1200,
	LG: 992,
	MD: 768,
	SM: 576,
};

/**
 * Gets the current width of the screen as a number.
 * @returns Current width of the screen.
 */
export const useMinWidth = (): number => {
	const [minWidth, setMinWidth] = useState(window.innerWidth);
	useEffect(() => {
		const handleWidthChange = () => {
			setMinWidth(window.innerWidth);
		};
		window.addEventListener('resize', handleWidthChange);

		return () => {
			//Remember to clean up after ourselves.
			window.removeEventListener('resize', handleWidthChange);
		};
	}, []);

	return minWidth;
};
