import axios, { AxiosInstance } from 'axios';

const API_VERSION_1 = '/api/v1';
class HttpClient {
	instance: AxiosInstance;

	constructor() {
		this.instance = axios.create({
			baseURL: import.meta.env.VITE_BASE_URL + API_VERSION_1,
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
	}
}

const httpClient = new HttpClient().instance;

export default httpClient;
