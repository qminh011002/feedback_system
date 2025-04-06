import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const createCommentSchema = z.object({
	content: z.string().min(1, { message: 'Content must be at least 1 character long' }),
	user_id: z.string().uuid({ message: 'User ID must be a valid UUID' }),
	feedback_id: z.string().uuid({ message: 'Feedback ID must be a valid UUID' }),
	author_name: z.string().min(1, { message: 'Author name must be at least 1 character long' })
});

export const validateCreateComment = (req: Request, res: Response, next: NextFunction) => {
	const result = createCommentSchema.safeParse(req.body);

	if (!result.success) {
		return res.status(400).json({
			message: 'Validation error',
			errors: result.error.errors.map((error) => error.message)
		});
	}

	next();
};
