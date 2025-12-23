import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import { AppError } from '../common/utils/AppError';

export const errorHandler: ErrorRequestHandler = (error: Error, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> => {
	console.error(`Error occured on PATH: ${req.path}`, error);

	if (error instanceof SyntaxError) {
		return res.status(HTTPSTATUS.BAD_REQUEST).json({
			message: 'Invalid JSON format, please check your request body'
		});
	}

	if (error instanceof AppError) {
		return res.status(error.statusCode).json({
			message: error.message,
			errorCode: error.errorCode
		});
	}

	return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
		message: 'Internal Server Error',
		error: error?.message || 'Unknown error occured'
	});
}