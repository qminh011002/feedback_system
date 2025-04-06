import status from 'http-status';
import pool from '../config/database';
import { TABLE_NAMES } from '../constants/table_name';
import bcrypt from 'bcrypt';
import { CustomError } from '../utils/error';

enum UserRole {
	user = 'user',
	admin = 'admin'
}

interface IUser {
	id: string;
	user_name: string;
	email: string;
	role: UserRole;
	imge_url: string;
}

export default class User {
	async getUsers() {
		const response = await pool.query(`SELECT id, username as user_name, email, role FROM ${TABLE_NAMES.USERS}`);

		return response.rows;
	}

	async getUserByEmailAndPassword(payload: { email: string; password: string }): Promise<IUser> {
		// 1. Lấy user từ database bằng email (KHÔNG so sánh password ở query)
		const userResponse = await pool.query(
			`SELECT id, username as user_name, email, role, imge_url, password 
		   FROM ${TABLE_NAMES.USERS} 
		   WHERE email = $1`,
			[payload.email]
		);

		if (userResponse.rows.length === 0) {
			throw new CustomError({
				message: 'Login failed',
				status: status.UNAUTHORIZED,
				data: { email: 'Email or password is incorrect' }
			});
		}

		const user = userResponse.rows[0];

		// 2. So sánh password sử dụng bcrypt
		const isPasswordValid = await bcrypt.compare(payload.password, user.password);

		if (!isPasswordValid) {
			throw new CustomError({
				message: 'Login failed',
				status: status.UNAUTHORIZED,
				data: { email: 'Email or password is incorrect' }
			});
		}

		// 3. Xóa password trước khi trả về user
		const { password, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}
}
