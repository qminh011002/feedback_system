import { ICategory } from '@/types/app.type';
import { IHttpResponse } from '@/types/http.type';
import httpClient from '@/utils/http';

export default class CategoryApis {
	getListCategories() {
		return httpClient.get<IHttpResponse<ICategory[]>>('/categories');
	}
}
