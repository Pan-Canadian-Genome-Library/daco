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

import { z } from 'zod';

// For Date instances (i.e. new Date())
export const Date = z.coerce.date();
export type Date = z.infer<typeof Date>;

// For YYYY-MM-DD Date strings (i.e. '2021-01-01')
export const DateString = z.string().date();
export type DateString = z.infer<typeof DateString>;

// For ISO8601 Datetime strings (i.e. '2021-01-01T00:00:00.000Z')
export const DateTime = z.string().datetime();
export type DateTime = z.infer<typeof DateTime>;

// For Datetime strings with timezone offset (i.e. '2021-01-01T00:00:00.000+00:00')
// Note: this will also accept ISO8601 without offset '2021-01-01T00:00:00.000Z'
export const DateTimeWithTimezone = z.string().datetime({ offset: true });
export type DateTimeWithTimezone = z.infer<typeof DateTimeWithTimezone>;
