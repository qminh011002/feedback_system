import pool from '../config/database';
import { TABLE_NAMES } from '../constants/table_name';

interface ICategory {
	id: string;
	name: string;
	description: string;
}

export default class Category {
	async getAllCategories(): Promise<ICategory[]> {
		const response = await pool.query(`SELECT id, name, description FROM ${TABLE_NAMES.CATEGORIES}`);

		return response.rows;
	}
}
