/**
 * A wrapper for `fetch`, used to append the application API URL to all fetch calls.
 * @param resource This defines the resource that you wish to fetch. This can be a string or a `URL` object — that provides the URL of the resource you want to fetch. Important - prepend your request URLs with `/`
 * @param options A `RequestInit` object containing any custom settings that you want to apply to the request.
 * @returns A promise containing a `Response` object.
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
 */
async function fetchClient(resource: string | URL, options?: RequestInit): Promise<Response> {
	const applicationAPIPrefix = import.meta.env.VITE_APPLICATION_API_URL;

	if (typeof resource === 'string') {
		resource = applicationAPIPrefix + resource;
	} else if (resource instanceof URL) {
		resource.hostname = applicationAPIPrefix;
	}

	return await fetch(resource, { ...options });
}
export { fetchClient as fetch };
