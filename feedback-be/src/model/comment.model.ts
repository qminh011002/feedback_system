// feedback_id
// user_id
// content

import pool from '../config/database';
import { TABLE_NAMES } from '../constants/table_name';

// author_name
export default class Comment {
	async createComment(body: {
		content: string;
		user_id: number;
		feedback_id: number;
		author_name: string;
		is_anonymous: boolean;
	}) {
		const { content, user_id, feedback_id, author_name, is_anonymous } = body;
		const query = `
            INSERT INTO ${TABLE_NAMES.COMMENTS} (content, user_id, feedback_id, author_name, is_anonymous)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, content, user_id, feedback_id, author_name, is_anonymous, created_at
        `;
		const params = [content, user_id, feedback_id, author_name, is_anonymous];

		const result = await pool.query(query, params);

		console.log(result.rows[0]);
		if (result.rows.length > 0) {
			return {
				id: result.rows[0].id,
				content: result.rows[0].content,
				user_id: result.rows[0].user_id,
				feedback_id: result.rows[0].feedback_id,
				author_name: result.rows[0].author_name,
				created_at: result.rows[0].created_at,
				is_anonymous: result.rows[0].is_anonymous
			};
		}
		return null;
	}
}
