/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
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

import { describe, expect, it } from 'vitest';

import { Name, OptionalName, EmptyOrOptionalName } from '../../src/entities/fields/index.js';

describe('Name', () => {
	it('Can be a string containing only letters', () => {
		expect(Name.safeParse('Simpson').success).true;
	});

	it('Can be a string containing letters and spaces', () => {
		expect(Name.safeParse('Homer Simpson').success).true;
		expect(Name.safeParse('homer simpson').success).true;
	});

	it('Cannot be undefined', () => {
		expect(Name.safeParse(undefined).success).false;
	});

	it('Cannot be an empty string', () => {
		expect(Name.safeParse('').success).false;
	});

	it('Cannot be null', () => {
		expect(Name.safeParse(null).success).false;
	});

	it('Cannot contain only whitespace', () => {
		expect(Name.safeParse(' ').success).false;
	});

	it('Can be a string containing letters and whitespace', () => {
		expect(Name.safeParse('homer      simpson').success).true;
	});

	it('Cannot be a string containing letters and numbers', () => {
		expect(Name.safeParse('HomerSimpson1').success).false;
	});

	it('Cannot be a string containing letters, numbers and spaces', () => {
		expect(Name.safeParse('Homer Simpson 1').success).false;
	});

	it('Cannot be a string containing only non-alphanumeric characters', () => {
		expect(Name.safeParse('-_-').success).false;
		expect(Name.safeParse("''").success).false;
		expect(Name.safeParse('!!').success).false;
		expect(Name.safeParse('*?').success).false;
	});

	it('Cannot be a string containing letters or numbers and non-alphanumeric characters', () => {
		expect(Name.safeParse('-Homer Simpson').success).false;
		expect(Name.safeParse("D'oh").success).false;
		expect(Name.safeParse('Homer_Simpson3').success).false;
		expect(Name.safeParse('Homer Simpon!').success).false;
	});
	it('Can contain French accents', () => {
		expect(Name.safeParse('ÀÂÇÉÈÊËÏÎÔÙÛÜ àâçéèêëïôùû').success).true
		expect(Name.safeParse('Homér Sïmpsôn').success).true
	})
	it('Can contain hyphen', () => {
		expect(Name.safeParse('Homer - Simpson').success).true
		expect(Name.safeParse('Homer-Simpson').success).true

	})
	it('Cannot start or end with a hyphen', () => {
		expect(Name.safeParse('-Homer Simpson').success).false
		expect(Name.safeParse('Homer Simpson-').success).false
	})
});

describe('OptionalName', () => {
	it('Can be a string containing only letters', () => {
		expect(OptionalName.safeParse('Simpson').success).true;
	});

	it('Can be a string containing letters and spaces', () => {
		expect(OptionalName.safeParse('Homer Simpson').success).true;
		expect(OptionalName.safeParse('homer simpson').success).true;
	});

	it('Can be undefined', () => {
		expect(OptionalName.safeParse(undefined).success).true;
	});

	it('Cannot be an empty string', () => {
		expect(OptionalName.safeParse('').success).false;
	});

	it('Cannot be a string containing only whitespace', () => {
		expect(OptionalName.safeParse(' ').success).false;
	});

	it('Cannot be null', () => {
		expect(OptionalName.safeParse(null).success).false;
	});

	it('Can be a string containing letters and whitespace', () => {
		expect(OptionalName.safeParse('homer      simpson').success).true;
	});

	it('Cannot be a string containing letters and numbers', () => {
		expect(OptionalName.safeParse('HomerSimpson1').success).false;
	});

	it('Cannot be a string containing letters, numbers and spaces', () => {
		expect(OptionalName.safeParse('Homer Simpson 1').success).false;
	});

	it('Cannot be a string containing only non-alphanumeric characters', () => {
		expect(OptionalName.safeParse('-_-').success).false;
		expect(OptionalName.safeParse("''").success).false;
		expect(OptionalName.safeParse('!!').success).false;
		expect(OptionalName.safeParse('*?').success).false;
	});

	it('Cannot be a string containing letters or numbers and non-alphanumeric characters', () => {
		expect(OptionalName.safeParse('-Homer Simpson').success).false;
		expect(OptionalName.safeParse("D'oh").success).false;
		expect(OptionalName.safeParse('Homer_Simpson3').success).false;
		expect(OptionalName.safeParse('Homer Simpon!').success).false;
	});
	it('Can contain French accents', () => {
		expect(OptionalName.safeParse('ÀÂÇÉÈÊËÏÎÔÙÛÜ àâçéèêëïôùû').success).true
		expect(OptionalName.safeParse('Homér Sïmpsôn').success).true
	})
	it('Can contain hyphen', () => {
		expect(OptionalName.safeParse('Homer - Simpson').success).true
		expect(OptionalName.safeParse('Homer-Simpson').success).true

	})
	it('Cannot start or end with a hyphen', () => {
		expect(OptionalName.safeParse('-Homer Simpson').success).false
		expect(OptionalName.safeParse('Homer Simpson-').success).false
	})
});

describe('EmptyOrOptionalName', () => {
	it('Can be a string containing only letters', () => {
		expect(EmptyOrOptionalName.safeParse('Simpson').success).true;
	});

	it('Can be a string containing letters and spaces', () => {
		expect(EmptyOrOptionalName.safeParse('Homer Simpson').success).true;
		expect(EmptyOrOptionalName.safeParse('homer simpson').success).true;
	});

	it('Can be undefined', () => {
		expect(EmptyOrOptionalName.safeParse(undefined).success).true;
	});

	it('Can be an empty string', () => {
		expect(EmptyOrOptionalName.safeParse('').success).true;
	});

	it('Can be a string containing only whitespace', () => {
		expect(EmptyOrOptionalName.safeParse(' ').success).true;
	});

	it('Cannot be null', () => {
		expect(EmptyOrOptionalName.safeParse(null).success).false;
	});

	it('Can be a string containing letters and whitespace', () => {
		expect(EmptyOrOptionalName.safeParse('homer      simpson').success).true;
	});

	it('Cannot be a string containing letters and numbers', () => {
		expect(EmptyOrOptionalName.safeParse('HomerSimpson1').success).false;
	});

	it('Cannot be a string containing letters, numbers and spaces', () => {
		expect(EmptyOrOptionalName.safeParse('Homer Simpson 1').success).false;
	});

	it('Cannot be a string containing only non-alphanumeric characters', () => {
		expect(EmptyOrOptionalName.safeParse('-_-').success).false;
		expect(EmptyOrOptionalName.safeParse("''").success).false;
		expect(EmptyOrOptionalName.safeParse('!!').success).false;
		expect(EmptyOrOptionalName.safeParse('*?').success).false;
	});

	it('Cannot be a string containing letters or numbers and non-alphanumeric characters', () => {
		expect(EmptyOrOptionalName.safeParse('-Homer Simpson').success).false;
		expect(EmptyOrOptionalName.safeParse("D'oh").success).false;
		expect(EmptyOrOptionalName.safeParse('Homer_Simpson3').success).false;
		expect(EmptyOrOptionalName.safeParse('Homer Simpon!').success).false;
	});
	it('Can contain French accents', () => {
		expect(EmptyOrOptionalName.safeParse('ÀÂÇÉÈÊËÏÎÔÙÛÜ àâçéèêëïôùû').success).true
		expect(EmptyOrOptionalName.safeParse('Homér Sïmpsôn').success).true
	})
	it('Can contain hyphen', () => {
		expect(EmptyOrOptionalName.safeParse('Homer - Simpson').success).true
		expect(EmptyOrOptionalName.safeParse('Homer-Simpson').success).true

	})
	it('Cannot start or end with a hyphen', () => {
		expect(EmptyOrOptionalName.safeParse('-Homer Simpson').success).false
		expect(EmptyOrOptionalName.safeParse('Homer Simpson-').success).false
	})
});
