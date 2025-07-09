class ExternalAuthError extends Error {
	code: string;

	constructor(code: string, message: string) {
		super(message);
		this.code = code;
		this.name = 'ExternalAuthError';
		Object.setPrototypeOf(this, ExternalAuthError.prototype);
	}
}

export default ExternalAuthError;
