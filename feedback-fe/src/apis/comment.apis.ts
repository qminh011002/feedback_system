import { IHttpResponse } from '@/types/http.type';
import httpClient from '@/utils/http';

export default class CommentApis {
	async createComment(body: {
		content: string;
		user_id: string;
		feedback_id: string;
		author_name: string;
		is_anonymous: boolean;
	}) {
		return httpClient.post<
			IHttpResponse<{
				id: string;
				user_id: string;
				author_name: string;
				content: string;
				created_at: string;
				imge_url: string;
				is_anonymous: boolean;
				feedback_id: string;
			}>
		>(`/comments`, body);
	}
}
