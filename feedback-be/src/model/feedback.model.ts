import pool from '../config/database';
import { TABLE_NAMES } from '../constants/table_name';

export default class Feedback {
	async getFeedbacks({
		pageSize = 10,
		currentPage = 1,
		sortBy = 'newest',
		filterStatus,
		filterCategory
	}: {
		pageSize?: number;
		currentPage?: number;
		sortBy?: string;
		filterStatus?: string;
		filterCategory?: string;
	}) {
		const offset = (Math.max(currentPage, 1) - 1) * pageSize;
		const whereConditions: string[] = ['f.is_deleted = false'];
		const params: (string | number)[] = [];

		// Xử lý filter status (case insensitive)
		if (filterStatus) {
			whereConditions.push(`LOWER(f.status) = LOWER($${params.length + 1})`);
			params.push(filterStatus);
		}

		if (filterCategory) {
			whereConditions.push(`c.id = $${params.length + 1}`); // Sửa thành ID
			params.push(filterCategory);
		}

		// Sort options
		const sortOptions: Record<string, string> = {
			newest: 'f.created_at DESC',
			oldest: 'f.created_at ASC',
			mostcomment: 'comment_count DESC',
			lesscomment: 'comment_count ASC',
			mostrating: 'f.rating DESC',
			leastrating: 'f.rating ASC'
		};

		const orderClause = sortOptions[sortBy] || 'f.created_at DESC';

		const query = `
            SELECT 
                f.id,
                f.title,
                f.content,
                f.rating,
                f.status,
				f.author_name,
                f.created_at,
				f.is_anonymous,
                c.name as category_name,
                COUNT(DISTINCT cm.id) as comment_count,
                u.username,
                u.imge_url as avatar
            FROM ${TABLE_NAMES.FEEDBACKS} f
            LEFT JOIN ${TABLE_NAMES.CATEGORIES} c ON f.category_id = c.id
            LEFT JOIN ${TABLE_NAMES.COMMENTS} cm ON f.id = cm.feedback_id
            LEFT JOIN ${TABLE_NAMES.USERS} u ON f.user_id = u.id
            ${whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : ''}
			AND f.is_deleted = false
            GROUP BY f.id, c.id, u.id
            ORDER BY ${orderClause}
            LIMIT $${params.length + 1}
            OFFSET $${params.length + 2}
        `;
		// Count query
		const countQuery = `
		SELECT COUNT(DISTINCT f.id) as total
		FROM ${TABLE_NAMES.FEEDBACKS} f
		LEFT JOIN ${TABLE_NAMES.CATEGORIES} c ON f.category_id = c.id
		${whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : ''}
	`;

		const queryParams = [...params, pageSize, offset];
		// Thực hiện query
		const [feedbacksRes, totalRes] = await Promise.all([
			pool.query(query, queryParams),
			pool.query(countQuery, params)
		]);

		const total = parseInt(totalRes.rows[0]?.total || '0', 10);
		const totalPages = Math.ceil(total / pageSize);

		return {
			pagination: {
				page_size: +pageSize,
				current_page: +currentPage,
				total_pages: totalPages,
				total_items: total
			},
			data: feedbacksRes.rows.map((fb) => ({
				id: fb.id,
				title: fb.title,
				content: fb.content,
				rating: parseInt(fb.rating) || 0,
				status: fb.status,
				is_anonymous: fb.is_anonymous,
				author_name: fb.author_name,
				created_at: fb.created_at,
				category_name: fb.category_name,
				vote_count: parseInt(fb.vote_count) || 0,
				comment_count: parseInt(fb.comment_count) || 0,
				user: {
					id: fb.user_id,
					username: fb.username,
					avatar: fb.avatar
				}
			}))
		};
	}

	//INSERT INTO feedbacks (title, content, category_id, user_id,author_name ,status, rating) values ()
	async createFeedback({
		title,
		content,
		category_id,
		user_id,
		author_name,
		status,
		rating,
		is_anonymous
	}: {
		title: string;
		content: string;
		category_id: number;
		user_id: number;
		author_name: string;
		status: string;
		rating: number;
		is_anonymous: boolean;
	}) {
		const query = `
			INSERT INTO ${TABLE_NAMES.FEEDBACKS} (title, content, category_id, user_id, author_name, status, rating, is_anonymous)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING id, title, content, category_id, user_id, author_name, status, rating
		`;
		const params = [title, content, category_id, user_id, author_name, status, rating, is_anonymous];

		const result = await pool.query(query, params);
		if (result.rows.length > 0) {
			return {
				id: result.rows[0].id,
				title: result.rows[0].title,
				content: result.rows[0].content,
				category_id: result.rows[0].category_id,
				user_id: result.rows[0].user_id,
				author_name: result.rows[0].author_name,
				status: result.rows[0].status,
				rating: result.rows[0].rating
			};
		}
		return null;
	}

	async deleteFeedback(id: string) {
		const query = `
			UPDATE ${TABLE_NAMES.FEEDBACKS}
			SET is_deleted = true
			WHERE id = $1
			RETURNING *
		`;
		const params = [id];

		const result = await pool.query(query, params);
		if (result.rows.length > 0) {
			return {
				id: result.rows[0].id
			};
		}
		return null;
	}

	async getFeedbackById(id: string) {
		const query = `
			SELECT f.*, c.name as category_name, u.username, u.imge_url as avatar
			FROM ${TABLE_NAMES.FEEDBACKS} f
			LEFT JOIN ${TABLE_NAMES.CATEGORIES} c ON f.category_id = c.id
			LEFT JOIN ${TABLE_NAMES.USERS} u ON f.user_id = u.id
			WHERE f.id = $1 AND f.is_deleted = false
		`;
		const params = [id];

		const result = await pool.query(query, params);
		if (result.rows.length > 0) {
			return {
				id: result.rows[0].id,
				title: result.rows[0].title,
				content: result.rows[0].content,
				is_comment_disabled: result.rows[0].is_comment_disabled,
				author_name: result.rows[0].author_name,
				created_at: result.rows[0].created_at,
				is_anonymous: result.rows[0].is_anonymous,
				rating: result.rows[0].rating,
				status: result.rows[0].status,
				category_name: result.rows[0].category_name,
				user: {
					id: result.rows[0].user_id,
					username: result.rows[0].username,
					avatar: result.rows[0].avatar
				}
			};
		}
		return null;
	}

	async updateStatusFeedback(id: string, status: string) {
		const query = `
			WITH updated_feedback AS (
				UPDATE ${TABLE_NAMES.FEEDBACKS}
				SET status = $1
				WHERE id = $2 AND is_deleted = false
				RETURNING *
			)
			SELECT 
				uf.*, 
				c.name as category_name, 
				u.username, 
				u.imge_url as avatar
			FROM updated_feedback uf
			LEFT JOIN ${TABLE_NAMES.CATEGORIES} c ON uf.category_id = c.id
			LEFT JOIN ${TABLE_NAMES.USERS} u ON uf.user_id = u.id
		`;
		console.log(status);
		const params = [status, id];

		const result = await pool.query(query, params);

		if (result.rows.length > 0) {
			return {
				id: result.rows[0].id,
				title: result.rows[0].title,
				content: result.rows[0].content,
				is_comment_disabled: result.rows[0].is_comment_disabled,
				author_name: result.rows[0].author_name,
				created_at: result.rows[0].created_at,
				is_anonymous: result.rows[0].is_anonymous,
				rating: result.rows[0].rating,
				status: result.rows[0].status,
				category_name: result.rows[0].category_name,
				user: {
					id: result.rows[0].user_id,
					username: result.rows[0].username,
					avatar: result.rows[0].avatar
				}
			};
		}
		return null;
	}

	async getListCommentByFeedbackId(feedback_id: string) {
		const query = `
			SELECT c.id,
			c.user_id,
			c.author_name,
			c.content,
			c.created_at,
			u.imge_url,
			c.is_anonymous,
			c.feedback_id
		FROM comments c
				JOIN feedbacks f ON c.feedback_id = f.id
				JOIN users u ON c.user_id = u.id
		WHERE c.is_deleted = false
		AND f.id = $1
		ORDER BY c.created_at DESC
			`;
		const params = [feedback_id];

		const result = await pool.query(query, params);
		if (result.rows.length > 0) {
			return result.rows.map((comment) => ({
				id: comment.id,
				user_id: comment.user_id,
				author_name: comment.author_name,
				content: comment.content,
				created_at: comment.created_at,
				imge_url: comment.imge_url,
				is_anonymous: comment.is_anonymous,
				feedback_id: comment.feedback_id
			}));
		}
		return null;
	}
}
