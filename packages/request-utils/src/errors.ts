export class BadRequest extends Error {
	constructor(msg: string, details?: unknown) {
		super(msg || "Sorry, looks like you sent a sent bad request. Please check the request and try again, or refer to our API documentation.");
		this.name = 'Bad Request';
		this.cause = details;
	}
}

export class NotFound extends Error {
	constructor(msg: string) {
		super(msg || "Sorry, looks like the resource you're trying to access does not exist.");
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
		super(msg || 'This functionallity is not yet implemented');
		this.name = 'Not Implemented';
	}
}

export class ServiceUnavailable extends Error {
	constructor(msg?: string) {
		super(msg || "Sorry, this service is currently unavailable and is not able to process your request. Please try again at later time. We apologize for the inconvenience.");
		this.name = 'Service unavailable';
	}
}

export class InternalServerError extends Error {
	constructor(msg?: string) {
		super(msg || "Sorry, something went wrong. We're unable to process your request, please try again later.");
		this.name = 'Internal Server Error';
	}
}

export const getErrorMessage = (error: unknown) => {
	if (error instanceof Error) { return error.message; }
	return String(error);
};
