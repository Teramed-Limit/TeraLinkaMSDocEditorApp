import axios, { AxiosInstance } from 'axios';

import { globalStore } from '../config/global-store';
import { NavigationService } from './NavigationService';

/**
 * 靜態類別用於管理 Axios 實例和攔截器
 */
export class ApiService {
	private static instance: AxiosInstance;
	private static isRefreshing = false;
	private static failedQueue: Array<{
		resolve: (token: string) => void;
		reject: (error: any) => void;
	}> = [];

	/**
	 * 處理佇列中的請求
	 */
	private static processQueue(error: any = null) {
		this.failedQueue.forEach((prom) => {
			if (error) {
				prom.reject(error);
			} else {
				prom.resolve(this.instance.defaults.headers.common.Authorization as string);
			}
		});
		this.failedQueue = [];
	}

	// private static isThirdPartyPage() {
	// 	const { pathname } = window.location;
	// 	return pathname.includes('/view-only');
	// }

	/**
	 * 取得 Axios 實例
	 */
	public static getInstance(): AxiosInstance {
		if (!this.instance) {
			this.instance = axios.create({
				baseURL: globalStore.IP_ADDRESS ?? '',
				withCredentials: true,
				timeout: 5000,
			});

			// 設定請求攔截器
			this.instance.interceptors.request.use(
				(config) => {
					// 無論是否為第三方 API，都會設定 x-api-key
					const newConfig = { ...config };

					// if (this.isThirdPartyPage()) {
					// 	const apiKey = sessionStorage.getItem('apikey');
					// 	if (apiKey) {
					// 		newConfig.headers['CareSystem-API-Key'] = apiKey;
					// 		newConfig.withCredentials = false;
					// 		return newConfig;
					// 	}
					// 	NavigationService.navigate('/no-auth');
					// 	return Promise.reject();
					// }

					const token = localStorage.getItem('accessToken');
					if (token) {
						newConfig.headers.Authorization = `Bearer ${token}`;
					}
					return newConfig;
				},
				(error) => {
					return Promise.reject(error);
				},
			);

			// 設定回應攔截器
			this.instance.interceptors.response.use(
				(response) => response,
				async (error) => {
					const originalRequest = error.config;

					if (originalRequest.url?.includes('/auth/refresh') && error.response?.status === 401) {
						// 清除認證狀態
						localStorage.removeItem('accessToken');
						NavigationService.navigate('/login');
						return Promise.reject(error);
					}

					// 如果是 401 錯誤且不是重試請求
					if (error.response?.status === 401 && !originalRequest.isRetry) {
						if (this.isRefreshing) {
							// 如果正在刷新 token，將請求加入佇列
							return new Promise((resolve, reject) => {
								this.failedQueue.push({ resolve, reject });
							})
								.then((token) => {
									originalRequest.headers.Authorization = `Bearer ${token}`;
									return this.instance(originalRequest);
								})
								.catch((err) => Promise.reject(err));
						}

						originalRequest.isRetry = true;
						this.isRefreshing = true;

						try {
							const response = await this.instance.post('/auth/refresh', { withCredentials: true });
							const { accessToken } = response.data;

							localStorage.setItem('accessToken', accessToken);
							this.instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
							this.processQueue();
							return await this.instance(originalRequest);
						} catch (refreshError) {
							this.processQueue(refreshError);
							// 清除認證狀態
							localStorage.removeItem('accessToken');
							NavigationService.navigate('/login');
							return await Promise.reject(refreshError);
						} finally {
							this.isRefreshing = false;
						}
					}

					return Promise.reject(error);
				},
			);
		}

		return this.instance;
	}
}
