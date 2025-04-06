import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const feedbackSchema = z.object({
	title: z.string().nonempty('Title is required'),
	content: z.string().nonempty('Content is required'),
	category_id: z.string().nonempty('Category ID is required'),
	user_id: z.string().nonempty('User ID is required'),
	author_name: z.string().nonempty('Author name is required'),
	status: z
		.enum(['open', 'closed', 'inprogress'])
		.refine((value) => ['open', 'closed', 'inprogress'].includes(value), {
			message: 'Status must be either "open", "closed", or "inprogress"'
		}),
	rating: z.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5'),
	is_anonymous: z.boolean()
});

export const validateFeedback = (req: Request, res: Response, next: NextFunction) => {
	try {
		feedbackSchema.parse(req.body);
		next();
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				message: 'Validation error',
				errors: error.errors
			});
		}
		next(error);
	}
};

const updateStatusSchema = z.object({
	status: z
		.enum(['open', 'closed', 'inprogress'])
		.refine((value) => ['open', 'closed', 'inprogress'].includes(value), {
			message: 'Status must be either "open", "closed", or "inprogress"'
		})
});

export const validateUpdateStatusFeedback = (req: Request, res: Response, next: NextFunction) => {
	try {
		updateStatusSchema.parse(req.body);
		next();
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				message: 'Validation error',
				errors: error.errors
			});
		}
		next(error);
	}
};
