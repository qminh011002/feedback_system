import { IQueryParams } from '@/pages/FeedbackPage/feedback-page';
import { IComment, IFeedback } from '@/types/app.type';
import { IHttpResponse } from '@/types/http.type';
import httpClient from '@/utils/http';

export interface IPagination {
	page_size: number;
	current_page: number;
	total_pages: number;
	total_items: number;
}

type FeedbackWithUserid = Omit<IFeedback, 'user'> & {
	user: {
		id: string;
		user_name: string;
		avatar: string;
	};
	is_comment_disabled: boolean;
};
export default class FeedbackApis {
	async getListFeedback(queryParams: IQueryParams) {
		return httpClient.get<
			IHttpResponse<{
				pagination: IPagination;
				data: IFeedback[];
			}>
		>('/feedbacks', {
			params: queryParams
		});
	}

	async createFeedback(body: {
		title: string;
		content: string;
		category_id: string;
		user_id: string;
		author_name: string;
		status: string;
		rating: number;
		is_anonymous: boolean;
	}) {
		return httpClient.post<IHttpResponse<IFeedback>>('/feedbacks', body);
	}

	async getFeedbackById(id: string) {
		return httpClient.get<IHttpResponse<FeedbackWithUserid>>(`/feedbacks/${id}`);
	}

	async getComentsByFeedbackId(id: string) {
		return httpClient.get<IHttpResponse<IComment[]>>(`/feedbacks/${id}/comments`);
	}

	async updateStatusFeedback(id: string, status: string) {
		return httpClient.patch<IHttpResponse<IFeedback & { is_comment_disabled: boolean }>>(
			`/feedbacks/${id}/status`,
			{
				status
			}
		);
	}

	async deleteFeedback(id: string) {
		return httpClient.delete<IHttpResponse<{ id: string }>>(`/feedbacks/${id}`);
	}
}
