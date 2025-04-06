import { NextFunction, Request, Response } from 'express';
import { CustomError } from './error';

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
	if (error instanceof CustomError) {
		res.status(error.status).json(error);
	} else {
		console.log(error);
		res.status(500).json(error);
	}
};
