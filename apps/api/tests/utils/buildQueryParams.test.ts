import assert from 'node:assert';
import { describe, it } from 'node:test';

import { buildQueryParams } from '@/utils/buildQueryParams.js';

describe('buildQueryParams', () => {
	it('Returns a formatted string for various type of inputs', () => {
		const params = { a: 1, b: false, c: 'two' };
		const result = buildQueryParams(params);
		const expected = `?a=1&b=false&c=two`;
		assert.strictEqual(result, expected);
	});
	it('Removes undefined values from object', () => {
		const params = { aa: 1, bb: false, cc: undefined, dd: 'two', ee: undefined };
		const result = buildQueryParams(params);
		const expected = `?aa=1&bb=false&dd=two`;
		assert.strictEqual(result, expected);
	});
});
