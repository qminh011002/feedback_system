import { Request, Response } from 'express';
import status from 'http-status';
import Comment from '../model/comment.model';
import { commonResponse } from '../utils/responseHandler';

export class CommentController {
	async createComment(req: Request, res: Response) {
		const { content, user_id, feedback_id, author_name, is_anonymous } = req.body;

		const result = await Comment.prototype.createComment({
			content,
			user_id,
			feedback_id,
			author_name,
			is_anonymous
		});

		if (!result) {
			return res.status(400).json({
				message: 'Create comment failed',
				data: null
			});
		}

		return res.status(status.CREATED).json(
			commonResponse({
				data: result,
				message: 'Create comment successfully'
			})
		);
	}
}
