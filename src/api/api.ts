// import { AuthResponse, LoginCredentials, RefreshTokenResponse } from '../types/login-credentials';

// export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
// 	const response = await ApiService.getInstance().post<AuthResponse>('/auth/login', credentials);
// 	return response.data;
// };

// // 刷新 token
// export const refreshToken = async (refreshTokenData: string): Promise<RefreshTokenResponse> => {
// 	const response = await ApiService.getInstance().post<RefreshTokenResponse>('/auth/refresh', { refreshTokenData });
// 	return response.data;
// };

// // 登出
// export const logout = async (): Promise<void> => {
// 	await ApiService.getInstance().post('/auth/logout');
// };
