/**
 * Convert an object containing URL Query Parameter values into a string that can be used as
 * query parameters in a URL. The output string will be formatted like: `?a=1&b=2`.
 *
 * Undefined parameters will be removed from the parameter query string
 *
 * @example
 * const params = { a: 1, b: false, c: undefined, d: 'two' };
 * buildQueryParams(params); // ?a=1&b=false&d=two
 */
export function buildQueryParams(params: Record<string, string | number | boolean | undefined>): string {
	const paramString = Object.entries(params)
		.filter(([key, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${value}`)
		.join(`&`);
	return `?${paramString}`;
}
