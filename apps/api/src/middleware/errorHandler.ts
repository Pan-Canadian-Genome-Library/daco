import { ErrorRequestHandler } from 'express';
import {
	BadRequest,
	InternalServerError,
	NotFound,
	NotImplemented,
	ServiceUnavailable,
	StatusConflict,
} from '@pcgl-daco/request-utils';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	console.error('error handler received error: ', err);
	let status: number;
	const customizableMsg = err.message;
	const details = err.cause;

	switch (true) {
		case err instanceof BadRequest:
			status = 400;
			break;
		case err instanceof NotFound:
			status = 404;
			break;
		case err instanceof StatusConflict:
			status = 409;
			break;
		case err instanceof InternalServerError:
			status = 500;
			break;
		case err instanceof NotImplemented:
			status = 501;
			break;
		case err instanceof ServiceUnavailable:
			status = 503;
			break;
		default:
			status = 500;
	}

	// Send the response without returning anything
	res.status(status).send({ error: err.name, message: customizableMsg, details: details });
};
