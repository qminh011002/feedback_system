import { IQueryParams } from '@/pages/FeedbackPage/feedback-page';
import { IFeedback } from '@/types/app.type';
import { IHttpResponse } from '@/types/http.type';
import httpClient from '@/utils/http';

export interface IPagination {
	page_size: number;
	current_page: number;
	total_pages: number;
	total_items: number;
}

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
		category_id: number;
		user_id: number;
		author_name: string;
		status: string;
		rating: number;
	}) {
		return httpClient.post<IHttpResponse<IFeedback>>('/feedbacks', body);
	}
}
