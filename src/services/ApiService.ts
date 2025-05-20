import axios, { AxiosInstance } from 'axios';

import { globalStore } from '../config/global-store';

/**
 * 靜態類別用於管理 Axios 實例和攔截器
 */
export class ApiService {
	private static instance: AxiosInstance;

	/**
	 * 取得 Axios 實例
	 */
	public static getInstance(): AxiosInstance {
		if (!this.instance) {
			this.instance = axios.create({
				baseURL: globalStore.IP_ADDRESS ?? '',
				// withCredentials: true,
				timeout: 5000,
			});
		}

		return this.instance;
	}
}
