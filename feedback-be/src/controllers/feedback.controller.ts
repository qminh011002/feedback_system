import { Request, Response } from 'express';
import status from 'http-status';
import Feedback from '../model/feedback.model';
import { commonResponse } from '../utils/responseHandler';

export default class FeedbackController {
	async getListFeedback(req: Request, res: Response) {
		const result = await Feedback.prototype.getFeedbacks(req.query);

		return res.status(status.OK).json(
			commonResponse({
				data: result,
				message: 'Get list feedback successfully'
			})
		);
	}

	async createFeedback(req: Request, res: Response) {
		const { title, content, category_id, author_name, user_id, status: _status, rating, is_anonymous } = req.body;

		const result = await Feedback.prototype.createFeedback({
			title,
			content,
			category_id,
			author_name,
			user_id,
			status: _status,
			rating,
			is_anonymous
		});

		return res.status(status.CREATED).json(
			commonResponse({
				data: result,
				message: 'Create feedback successfully'
			})
		);
	}

	async deleteFeedback(req: Request, res: Response) {
		const { id } = req.params;

		const result = await Feedback.prototype.deleteFeedback(id);

		return res.status(status.OK).json(
			commonResponse({
				data: result,
				message: 'Delete feedback successfully'
			})
		);
	}

	async getFeedbackById(req: Request, res: Response) {
		const { id } = req.params;

		const result = await Feedback.prototype.getFeedbackById(id);

		return res.status(status.OK).json(
			commonResponse({
				data: result,
				message: 'Get feedback by id successfully'
			})
		);
	}

	async updateStatusFeedback(req: Request, res: Response) {
		const { id } = req.params;
		console.log(req.params);
		const { status: _status } = req.body;

		console.log(id, _status);
		const result = await Feedback.prototype.updateStatusFeedback(id, _status);

		return res.status(status.OK).json(
			commonResponse({
				data: result,
				message: 'Update feedback status successfully'
			})
		);
	}

	async getListCommentByFeedbackId(req: Request, res: Response) {
		const { id } = req.params;

		const result = await Feedback.prototype.getListCommentByFeedbackId(id);

		return res.status(status.OK).json(
			commonResponse({
				data: result,
				message: 'Get list comment by feedback id successfully'
			})
		);
	}
}
