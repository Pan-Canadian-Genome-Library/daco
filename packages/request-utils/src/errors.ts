export class BadRequest extends Error {
	constructor(msg: string, details?: unknown) {
		super(msg);
		this.name = 'Bad Request';
		this.cause = details;
	}
}

export class NotFound extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = 'Not Found';
	}
}

export class StatusConflict extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = 'Conflict';
	}
}

export class NotImplemented extends Error {
	constructor(msg?: string) {
		super(msg || 'This feature or functionality has not yet been implemented. Sorry.');
		this.name = 'Not Implemented';
	}
}

export class ServiceUnavailable extends Error {
	constructor(msg?: string) {
		super(msg || 'Sorry, the application is unable to process your request at this time. Please try again later.');
		this.name = 'Service Unavailable';
	}
}

export class InternalServerError extends Error {
	constructor(msg?: string) {
		super(msg || 'Sorry, something went wrong while processing your request, we apologise for the inconvenience.');
		this.name = 'Internal Server Error';
	}
}

export const getErrorMessage = (error: unknown) => {
	if (error instanceof Error) return error.message;
	return String(error);
};