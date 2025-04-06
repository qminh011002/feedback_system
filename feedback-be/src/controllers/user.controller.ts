import { Request, Response } from 'express';
import status from 'http-status';
import User from '../model/user.model';

export default class UserController {
	async getListUser(req: Request, res: Response) {
		const result = await User.prototype.getUsers();

		return res.status(status.OK).json({
			message: 'Get list successful',
			data: result
		});
	}

	async login(req: Request, res: Response) {
		const { email, password } = req.body;
		const result = await User.prototype.getUserByEmailAndPassword({ email, password });

		if (!result) {
			return res.status(status.FORBIDDEN).json({
				message: '',
				data: {
					error: ''
				}
			});
		}
		return res.status(status.OK).json({
			message: 'Login successfully',
			data: result ?? '123'
		});
	}
}
