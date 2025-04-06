import { IUser } from '@/types/app.type';
import { IHttpResponse } from '@/types/http.type';
import httpClient from '@/utils/http';

export default class AuthenticationApi {
	login(body: { email: string; password: string }) {
		return httpClient.post<IHttpResponse<IUser>>('/auth/login', body);
	}
}
