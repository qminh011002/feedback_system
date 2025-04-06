import { Request, Response } from 'express';
import status from 'http-status';
import Category from '../model/category.model';
import { commonResponse } from '../utils/responseHandler';

export default class CategoryController {
	async getListCategory(req: Request, res: Response) {
		const result = await Category.prototype.getAllCategories();

		return res.status(status.OK).json(
			commonResponse({
				data: result,
				message: 'Get list category successfully'
			})
		);
	}
}
